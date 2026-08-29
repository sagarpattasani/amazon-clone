package com.amazonclone.service;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.ProductDto;
import com.amazonclone.entity.*;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // ═══════════════════════════════════
    // SELLER DASHBOARD
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public ApiResponse.SellerDashboard getSellerDashboard(Long userId) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        long totalProducts = productRepository.countBySellerIdAndIsActiveTrue(seller.getId());
        long totalOrders = orderItemRepository.countBySellerId(seller.getId());

        BigDecimal totalEarnings = orderItemRepository.getTotalEarningsBySellerId(seller.getId());
        if (totalEarnings == null) totalEarnings = BigDecimal.ZERO;

        long pendingOrders = orderItemRepository.countBySellerIdAndItemStatus(
                seller.getId(), Order.OrderStatus.PENDING);

        // Recent orders for this seller
        List<Map<String, Object>> recentOrders = orderItemRepository
                .findBySellerIdOrderByCreatedAtDesc(seller.getId(), PageRequest.of(0, 10))
                .stream().map(item -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", item.getId());
                    map.put("orderNumber", item.getOrder().getOrderNumber());
                    map.put("productTitle", item.getProductTitle());
                    map.put("quantity", item.getQuantity());
                    map.put("total", item.getTotalPrice());
                    map.put("status", item.getItemStatus().name());
                    map.put("date", item.getCreatedAt() != null ? item.getCreatedAt().toString() : null);
                    return map;
                }).collect(Collectors.toList());

        return ApiResponse.SellerDashboard.builder()
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalEarnings(totalEarnings)
                .rating(seller.getRating())
                .pendingOrders(pendingOrders)
                .recentOrders(recentOrders)
                .build();
    }

    // ═══════════════════════════════════
    // REGISTER AS SELLER
    // ═══════════════════════════════════
    @Transactional
    public Map<String, Object> registerSeller(Long userId, String businessName, String gstNumber, String description) {
        if (sellerRepository.existsByUserId(userId)) {
            throw new DuplicateResourceException("You are already registered as a seller");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(User.Role.SELLER);
        userRepository.save(user);

        Seller seller = Seller.builder()
                .user(user)
                .businessName(businessName)
                .gstin(gstNumber)
                .businessDescription(description)
                .isVerified(false)
                .rating(BigDecimal.ZERO)
                .totalSales(0)
                .build();
        seller = sellerRepository.save(seller);

        Map<String, Object> result = new HashMap<>();
        result.put("id", seller.getId());
        result.put("businessName", seller.getBusinessName());
        result.put("isVerified", seller.getIsVerified());
        log.info("New seller registered: {} by user: {}", businessName, user.getEmail());
        return result;
    }

    // ═══════════════════════════════════
    // SELLER PRODUCTS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<ProductDto.ProductListItem> getSellerProducts(Long userId, int page, int size) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Product> products = productRepository.findBySellerIdAndIsActiveTrue(seller.getId(), pageable);

        return products.map(p -> {
            String img = productImageRepository.findFirstByProductIdAndIsPrimaryTrue(p.getId())
                    .map(ProductImage::getImageUrl).orElse(null);
            return ProductDto.ProductListItem.builder()
                    .id(p.getId()).title(p.getTitle()).brand(p.getBrand())
                    .price(p.getPrice()).mrp(p.getMrp()).discountPercent(p.getDiscountPercent())
                    .avgRating(p.getAvgRating()).totalRatings(p.getTotalRatings())
                    .primaryImage(img).inStock(p.isInStock()).build();
        });
    }

    // ═══════════════════════════════════
    // UPDATE PRODUCT (SELLER)
    // ═══════════════════════════════════
    @Transactional
    public void updateProduct(Long userId, Long productId, ProductDto.CreateProductRequest request) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new BadRequestException("You can only edit your own products");
        }

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setAbout(request.getAbout());
        product.setBulletPoints(request.getBulletPoints());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setMrp(request.getMrp());
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : product.getStockQuantity());
        productRepository.save(product);
        log.info("Product {} updated by seller {}", productId, seller.getBusinessName());
    }

    // ═══════════════════════════════════
    // DELETE PRODUCT (SOFT DELETE)
    // ═══════════════════════════════════
    @Transactional
    public void deleteProduct(Long userId, Long productId) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            throw new BadRequestException("You can only delete your own products");
        }

        product.setIsActive(false);
        productRepository.save(product);
        log.info("Product {} soft-deleted by seller {}", productId, seller.getBusinessName());
    }

    // ═══════════════════════════════════
    // SELLER ORDERS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<Map<String, Object>> getSellerOrders(Long userId, int page, int size) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<OrderItem> items = orderItemRepository.findBySellerId(seller.getId(), pageable);

        return items.map(item -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item.getId());
            map.put("orderNumber", item.getOrder().getOrderNumber());
            map.put("customerName", item.getOrder().getUser().getName());
            map.put("productTitle", item.getProductTitle());
            map.put("productImage", item.getProductImage());
            map.put("quantity", item.getQuantity());
            map.put("unitPrice", item.getUnitPrice());
            map.put("total", item.getTotalPrice());
            map.put("status", item.getItemStatus().name());
            map.put("createdAt", item.getCreatedAt() != null ? item.getCreatedAt().toString() : null);
            return map;
        });
    }
}
