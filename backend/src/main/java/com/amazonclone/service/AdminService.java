package com.amazonclone.service;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.OrderDto;
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
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final PaymentRepository paymentRepository;
    private final ReturnRequestRepository returnRequestRepository;
    private final CategoryRepository categoryRepository;

    // ═══════════════════════════════════
    // DASHBOARD STATS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public ApiResponse.AdminDashboard getDashboard() {
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.countByIsActiveTrue();
        long totalSellers = sellerRepository.count();

        BigDecimal totalRevenue = orderRepository.getTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal todayRevenue = orderRepository.getRevenueAfter(
                LocalDateTime.now().withHour(0).withMinute(0).withSecond(0));
        if (todayRevenue == null) todayRevenue = BigDecimal.ZERO;

        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long pendingReturns = returnRequestRepository.countByStatus(ReturnRequest.ReturnStatus.REQUESTED);

        // Recent orders
        List<Map<String, Object>> recentOrders = orderRepository
                .findAll(PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().stream()
                .map(o -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", o.getId());
                    map.put("orderNumber", o.getOrderNumber());
                    map.put("userName", o.getUser().getName());
                    map.put("total", o.getTotalAmount());
                    map.put("status", o.getStatus().name());
                    map.put("date", o.getCreatedAt().toString());
                    return map;
                }).collect(Collectors.toList());

        return ApiResponse.AdminDashboard.builder()
                .totalUsers(totalUsers)
                .totalOrders(totalOrders)
                .totalProducts(totalProducts)
                .totalSellers(totalSellers)
                .totalRevenue(totalRevenue)
                .todayRevenue(todayRevenue)
                .pendingOrders(pendingOrders)
                .pendingReturns(pendingReturns)
                .recentOrders(recentOrders)
                .build();
    }

    // ═══════════════════════════════════
    // USER MANAGEMENT
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<Map<String, Object>> getAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users;
        if (search != null && !search.isEmpty()) {
            users = userRepository.searchUsers(search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("phone", u.getPhone());
            map.put("role", u.getRole().name());
            map.put("isActive", u.getIsActive());
            map.put("isEmailVerified", u.getIsVerified());
            map.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
            return map;
        });
    }

    @Transactional
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(!user.getIsActive());
        userRepository.save(user);
        log.info("User {} status toggled to {}", user.getEmail(), user.getIsActive());
    }

    @Transactional
    public void changeUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        userRepository.save(user);
        log.info("User {} role changed to {}", user.getEmail(), role);
    }

    // ═══════════════════════════════════
    // ORDER MANAGEMENT
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<Map<String, Object>> getAllOrders(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orders;
        if (status != null && !status.isEmpty()) {
            orders = orderRepository.findByStatus(Order.OrderStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }
        return orders.map(o -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", o.getId());
            map.put("orderNumber", o.getOrderNumber());
            map.put("userName", o.getUser().getName());
            map.put("userEmail", o.getUser().getEmail());
            map.put("total", o.getTotalAmount());
            map.put("status", o.getStatus().name());
            map.put("paymentStatus", o.getPaymentStatus().name());
            map.put("paymentMethod", o.getPaymentMethod());
            map.put("itemCount", orderItemRepository.countByOrderId(o.getId()));
            map.put("createdAt", o.getCreatedAt().toString());
            return map;
        });
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        order.setStatus(newStatus);

        if (newStatus == Order.OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
            order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
        } else if (newStatus == Order.OrderStatus.SHIPPED) {
            order.setShippedAt(LocalDateTime.now());
        }

        orderRepository.save(order);

        // Update all items status
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        items.forEach(item -> {
            item.setItemStatus(newStatus);
            orderItemRepository.save(item);
        });

        log.info("Order {} status updated to {}", order.getOrderNumber(), status);
    }

    // ═══════════════════════════════════
    // CATEGORY MANAGEMENT
    // ═══════════════════════════════════
    @Transactional
    public Map<String, Object> createCategory(String name, String slug, String imageUrl, Long parentId) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug != null ? slug : name.toLowerCase().replaceAll("\\s+", "-"));
        category.setImageUrl(imageUrl);
        category.setIsActive(true);
        category.setSortOrder(0);

        if (parentId != null) {
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
        }

        category = categoryRepository.save(category);
        Map<String, Object> result = new HashMap<>();
        result.put("id", category.getId());
        result.put("name", category.getName());
        result.put("slug", category.getSlug());
        return result;
    }

    // ═══════════════════════════════════
    // RETURN MANAGEMENT
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<OrderDto.ReturnResponse> getAllReturns(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ReturnRequest> returns;
        if (status != null && !status.isEmpty()) {
            returns = returnRequestRepository.findByStatus(
                    ReturnRequest.ReturnStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            returns = returnRequestRepository.findAll(pageable);
        }
        return returns.map(r -> OrderDto.ReturnResponse.builder()
                .id(r.getId())
                .orderItemId(r.getOrderItem().getId())
                .productTitle(r.getOrderItem().getProductTitle())
                .productImage(r.getOrderItem().getProductImage())
                .reason(r.getReason().name())
                .description(r.getDescription())
                .status(r.getStatus().name())
                .refundAmount(r.getRefundAmount())
                .createdAt(r.getCreatedAt())
                .build());
    }

    @Transactional
    public void processReturn(Long returnId, String action) {
        ReturnRequest returnRequest = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found"));

        switch (action.toUpperCase()) {
            case "APPROVE" -> {
                returnRequest.setStatus(ReturnRequest.ReturnStatus.APPROVED);
                returnRequest.setApprovedAt(LocalDateTime.now());
            }
            case "REJECT" -> returnRequest.setStatus(ReturnRequest.ReturnStatus.REJECTED);
            case "COMPLETE" -> {
                returnRequest.setStatus(ReturnRequest.ReturnStatus.REFUND_COMPLETED);
                returnRequest.setRefundedAt(LocalDateTime.now());
                // Restore stock
                OrderItem item = returnRequest.getOrderItem();
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        returnRequestRepository.save(returnRequest);
        log.info("Return {} processed: {}", returnId, action);
    }
}
