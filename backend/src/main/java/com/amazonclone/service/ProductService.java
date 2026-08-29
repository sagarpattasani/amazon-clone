package com.amazonclone.service;

import com.amazonclone.dto.ProductDto;
import com.amazonclone.entity.*;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductRatingRepository productRatingRepository;
    private final CategoryRepository categoryRepository;
    private final SellerRepository sellerRepository;
    private final WishlistRepository wishlistRepository;

    // ═══════════════════════════════════
    // GET PRODUCTS WITH FILTERS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<ProductDto.ProductListItem> getProducts(ProductDto.ProductFilter filter) {
        int page = filter.getPage() != null ? filter.getPage() : 0;
        int size = filter.getSize() != null ? filter.getSize() : 20;

        Sort sort = getSort(filter.getSortBy());
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Product> spec = buildSpecification(filter);
        Page<Product> products = productRepository.findAll(spec, pageable);

        return products.map(this::mapToListItem);
    }

    // ═══════════════════════════════════
    // GET PRODUCT DETAIL
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public ProductDto.ProductResponse getProductById(Long id, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductDto.ProductResponse response = mapToProductResponse(product);

        // Check if product is in user's wishlist
        if (userId != null) {
            response.setInWishlist(wishlistRepository.existsByUserIdAndProductId(userId, id));
        }

        return response;
    }

    // ═══════════════════════════════════
    // SEARCH PRODUCTS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<ProductDto.ProductListItem> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.searchProducts(query, pageable);
        return products.map(this::mapToListItem);
    }

    // ═══════════════════════════════════
    // FEATURED PRODUCTS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public List<ProductDto.ProductListItem> getFeaturedProducts() {
        return productRepository.findByIsActiveTrueAndIsFeaturedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToListItem)
                .collect(Collectors.toList());
    }

    // ═══════════════════════════════════
    // DEALS OF THE DAY
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public List<ProductDto.ProductListItem> getDealsOfTheDay() {
        return productRepository.findByIsActiveTrueAndIsDealOfDayTrue()
                .stream()
                .map(this::mapToListItem)
                .collect(Collectors.toList());
    }

    // ═══════════════════════════════════
    // SIMILAR PRODUCTS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public List<ProductDto.ProductListItem> getSimilarProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Long categoryId = product.getCategory() != null ? product.getCategory().getId() : null;
        if (categoryId == null) return List.of();

        return productRepository.findSimilarProducts(categoryId, productId, PageRequest.of(0, 10))
                .stream().map(this::mapToListItem).collect(Collectors.toList());
    }

    // ═══════════════════════════════════
    // GET REVIEWS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<ProductDto.ReviewResponse> getProductReviews(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRatingRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable)
                .map(this::mapToReviewResponse);
    }

    // ═══════════════════════════════════
    // ADD REVIEW
    // ═══════════════════════════════════
    @Transactional
    public ProductDto.ReviewResponse addReview(Long productId, Long userId, ProductDto.CreateReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (productRatingRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new DuplicateResourceException("You have already reviewed this product");
        }

        User user = new User();
        user.setId(userId);

        ProductRating rating = ProductRating.builder()
                .product(product)
                .user(user)
                .rating(request.getRating())
                .reviewTitle(request.getReviewTitle())
                .reviewBody(request.getReviewBody())
                .reviewImages(request.getReviewImages())
                .verifiedPurchase(true) // Simplified; in production, verify from orders
                .build();

        rating = productRatingRepository.save(rating);

        // Update product averages
        Double avgRating = productRatingRepository.getAverageRatingByProductId(productId);
        long totalReviews = productRatingRepository.countByProductId(productId);
        product.setAvgRating(avgRating != null ? BigDecimal.valueOf(avgRating) : BigDecimal.ZERO);
        product.setTotalRatings((int) totalReviews);
        product.setTotalReviews((int) totalReviews);
        productRepository.save(product);

        return mapToReviewResponse(rating);
    }

    // ═══════════════════════════════════
    // CREATE PRODUCT (Seller/Admin)
    // ═══════════════════════════════════
    @Transactional
    public ProductDto.ProductResponse createProduct(ProductDto.CreateProductRequest request, Long userId) {
        Seller seller = sellerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller profile not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        int discount = 0;
        if (request.getMrp() != null && request.getMrp().compareTo(request.getPrice()) > 0) {
            discount = request.getMrp().subtract(request.getPrice())
                    .multiply(BigDecimal.valueOf(100))
                    .divide(request.getMrp(), 0, java.math.RoundingMode.HALF_UP)
                    .intValue();
        }

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .about(request.getAbout())
                .bulletPoints(request.getBulletPoints())
                .brand(request.getBrand())
                .category(category)
                .seller(seller)
                .price(request.getPrice())
                .mrp(request.getMrp())
                .discountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : discount)
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .sku(request.getSku())
                .weight(request.getWeight())
                .dimensions(request.getDimensions())
                .isFeatured(request.getIsFeatured() != null && request.getIsFeatured())
                .build();

        product = productRepository.save(product);

        // Save images
        if (request.getImageUrls() != null) {
            final Product savedProduct = product;
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(ProductImage.builder()
                        .product(savedProduct)
                        .imageUrl(request.getImageUrls().get(i))
                        .isPrimary(i == 0)
                        .sortOrder(i)
                        .build());
            }
            productImageRepository.saveAll(images);
        }

        log.info("Product created: {} by seller: {}", product.getTitle(), seller.getBusinessName());
        return mapToProductResponse(product);
    }

    // ═══════════════════════════════════
    // GET BRANDS FOR CATEGORY
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public List<String> getBrands(Long categoryId) {
        if (categoryId != null) {
            return productRepository.findBrandsByCategoryId(categoryId);
        }
        return productRepository.findAllActiveBrands();
    }

    // ═══════════════════════════════════
    // HELPER: Build Dynamic Specification
    // ═══════════════════════════════════
    private Specification<Product> buildSpecification(ProductDto.ProductFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("isActive")));

            if (filter.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategoryId()));
            }
            if (filter.getBrand() != null && !filter.getBrand().isEmpty()) {
                predicates.add(cb.equal(root.get("brand"), filter.getBrand()));
            }
            if (filter.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            }
            if (filter.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            }
            if (filter.getMinRating() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("avgRating"), BigDecimal.valueOf(filter.getMinRating())));
            }
            if (filter.getMinDiscount() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("discountPercent"), filter.getMinDiscount()));
            }
            if (filter.getQuery() != null && !filter.getQuery().isEmpty()) {
                String q = "%" + filter.getQuery().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), q),
                        cb.like(cb.lower(root.get("description")), q),
                        cb.like(cb.lower(root.get("brand")), q)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Sort getSort(String sortBy) {
        if (sortBy == null) return Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (sortBy) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "rating" -> Sort.by(Sort.Direction.DESC, "avgRating");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            case "popularity" -> Sort.by(Sort.Direction.DESC, "totalSold");
            case "discount" -> Sort.by(Sort.Direction.DESC, "discountPercent");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }

    // ═══════════════════════════════════
    // MAPPERS
    // ═══════════════════════════════════
    private ProductDto.ProductListItem mapToListItem(Product p) {
        String primaryImage = null;
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            primaryImage = p.getImages().stream()
                    .filter(ProductImage::getIsPrimary)
                    .map(ProductImage::getImageUrl)
                    .findFirst()
                    .orElse(p.getImages().get(0).getImageUrl());
        }
        return ProductDto.ProductListItem.builder()
                .id(p.getId())
                .title(p.getTitle())
                .brand(p.getBrand())
                .price(p.getPrice())
                .mrp(p.getMrp())
                .discountPercent(p.getDiscountPercent())
                .avgRating(p.getAvgRating())
                .totalRatings(p.getTotalRatings())
                .primaryImage(primaryImage)
                .isFeatured(p.getIsFeatured())
                .inStock(p.isInStock())
                .build();
    }

    private ProductDto.ProductResponse mapToProductResponse(Product p) {
        ProductDto.ProductResponse.ProductResponseBuilder builder = ProductDto.ProductResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .about(p.getAbout())
                .bulletPoints(p.getBulletPoints())
                .brand(p.getBrand())
                .price(p.getPrice())
                .mrp(p.getMrp())
                .discountPercent(p.getDiscountPercent())
                .stockQuantity(p.getStockQuantity())
                .sku(p.getSku())
                .weight(p.getWeight())
                .dimensions(p.getDimensions())
                .isFeatured(p.getIsFeatured())
                .isDealOfDay(p.getIsDealOfDay())
                .avgRating(p.getAvgRating())
                .totalRatings(p.getTotalRatings())
                .totalReviews(p.getTotalReviews())
                .createdAt(p.getCreatedAt());

        if (p.getCategory() != null) {
            builder.category(ProductDto.CategoryInfo.builder()
                    .id(p.getCategory().getId())
                    .name(p.getCategory().getName())
                    .slug(p.getCategory().getSlug())
                    .build());
        }

        if (p.getSeller() != null) {
            builder.seller(ProductDto.SellerInfo.builder()
                    .id(p.getSeller().getId())
                    .businessName(p.getSeller().getBusinessName())
                    .rating(p.getSeller().getRating())
                    .build());
        }

        // Images
        List<ProductImage> images = productImageRepository.findByProductIdOrderBySortOrder(p.getId());
        builder.images(images.stream().map(img -> ProductDto.ImageInfo.builder()
                .id(img.getId())
                .imageUrl(img.getImageUrl())
                .isPrimary(img.getIsPrimary())
                .sortOrder(img.getSortOrder())
                .build()).collect(Collectors.toList()));

        // Variants
        List<ProductVariant> variants = productVariantRepository.findByProductIdAndIsActiveTrue(p.getId());
        builder.variants(variants.stream().map(v -> ProductDto.VariantInfo.builder()
                .id(v.getId())
                .variantName(v.getVariantName())
                .color(v.getColor())
                .size(v.getSize())
                .storage(v.getStorage())
                .priceModifier(v.getPriceModifier())
                .stock(v.getStock())
                .imageUrl(v.getImageUrl())
                .build()).collect(Collectors.toList()));

        return builder.build();
    }

    private ProductDto.ReviewResponse mapToReviewResponse(ProductRating r) {
        return ProductDto.ReviewResponse.builder()
                .id(r.getId())
                .userName(r.getUser() != null ? r.getUser().getName() : "Anonymous")
                .rating(r.getRating())
                .reviewTitle(r.getReviewTitle())
                .reviewBody(r.getReviewBody())
                .reviewImages(r.getReviewImages())
                .verifiedPurchase(r.getVerifiedPurchase())
                .helpfulVotes(r.getHelpfulVotes())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
