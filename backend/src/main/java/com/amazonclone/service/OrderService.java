package com.amazonclone.service;

import com.amazonclone.dto.OrderDto;
import com.amazonclone.entity.*;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserAddressRepository userAddressRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final DeliveryTrackingRepository deliveryTrackingRepository;
    private final PaymentRepository paymentRepository;
    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    // ═══════════════════════════════════
    // CHECKOUT
    // ═══════════════════════════════════
    @Transactional
    public OrderDto.OrderResponse checkout(Long userId, OrderDto.CheckoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get cart items
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));
        List<CartItem> cartItems = cartItemRepository.findByCartIdAndSavedForLaterFalse(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // Validate address
        UserAddress address = userAddressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        // Calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            subtotal = subtotal.add(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        BigDecimal discount = BigDecimal.ZERO;
        Coupon coupon = null;

        // Apply coupon
        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            coupon = couponRepository.findByCodeAndIsActiveTrue(request.getCouponCode())
                    .orElseThrow(() -> new BadRequestException("Invalid coupon code"));
            if (!coupon.isValid()) {
                throw new BadRequestException("Coupon is expired or used up");
            }
            if (subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
                throw new BadRequestException("Minimum order amount for this coupon is ₹" + coupon.getMinOrderAmount());
            }
            long userUsage = couponUsageRepository.countByCouponIdAndUserId(coupon.getId(), userId);
            if (coupon.getPerUserLimit() != null && userUsage >= coupon.getPerUserLimit()) {
                throw new BadRequestException("Coupon usage limit reached");
            }
            if (coupon.getDiscountType() == Coupon.DiscountType.PERCENT) {
                discount = subtotal.multiply(coupon.getDiscountValue()).divide(BigDecimal.valueOf(100));
                if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
                    discount = coupon.getMaxDiscount();
                }
            } else {
                discount = coupon.getDiscountValue();
            }
        }

        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.18)); // 18% GST
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(499)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(40);
        BigDecimal total = subtotal.subtract(discount).add(tax).add(shipping);

        // Generate order number
        String orderNumber = "AMZ-" + System.currentTimeMillis() + "-" + new Random().nextInt(9999);

        // Create order
        Order order = Order.builder()
                .user(user)
                .orderNumber(orderNumber)
                .status(Order.OrderStatus.PENDING)
                .subtotalAmount(subtotal)
                .discountAmount(discount)
                .taxAmount(tax)
                .shippingAmount(shipping)
                .totalAmount(total)
                .coupon(coupon)
                .couponCode(request.getCouponCode())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(request.getPaymentMethod().equals("COD") ? Order.PaymentStatus.PENDING : Order.PaymentStatus.PENDING)
                .shippingAddressId(address.getId())
                .shippingName(address.getFullName())
                .shippingPhone(address.getPhone())
                .shippingAddress(address.getAddressLine1() + (address.getAddressLine2() != null ? ", " + address.getAddressLine2() : ""))
                .shippingCity(address.getCity())
                .shippingState(address.getState())
                .shippingPincode(address.getPincode())
                .notes(request.getNotes())
                .expectedDeliveryDate(LocalDate.now().plusDays(5))
                .build();

        order = orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            String productImage = productImageRepository.findFirstByProductIdAndIsPrimaryTrue(product.getId())
                    .map(ProductImage::getImageUrl).orElse(null);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .variant(cartItem.getVariant())
                    .seller(product.getSeller())
                    .productTitle(product.getTitle())
                    .productImage(productImage)
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getPrice())
                    .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                    .itemStatus(Order.OrderStatus.PENDING)
                    .build();
            orderItems.add(orderItem);

            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            product.setTotalSold(product.getTotalSold() + cartItem.getQuantity());
            productRepository.save(product);
        }
        orderItemRepository.saveAll(orderItems);

        // Create delivery tracking
        for (OrderItem item : orderItems) {
            String trackingNumber = "TRK" + System.currentTimeMillis() + new Random().nextInt(999);
            String[] couriers = {"Delhivery", "BlueDart", "DTDC", "Ekart"};
            String courier = couriers[new Random().nextInt(couriers.length)];

            List<Map<String, Object>> timeline = new ArrayList<>();
            Map<String, Object> event = new HashMap<>();
            event.put("status", "Order Placed");
            event.put("location", address.getCity());
            event.put("timestamp", LocalDateTime.now().toString());
            event.put("description", "Your order has been placed successfully");
            timeline.add(event);

            DeliveryTracking tracking = DeliveryTracking.builder()
                    .orderItem(item)
                    .order(order)
                    .courierName(courier)
                    .trackingNumber(trackingNumber)
                    .currentStatus("Order Placed")
                    .currentLocation(address.getCity())
                    .estimatedDelivery(LocalDate.now().plusDays(5))
                    .timelineEvents(timeline)
                    .build();
            deliveryTrackingRepository.save(tracking);
        }

        // Update coupon usage
        if (coupon != null) {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
            CouponUsage usage = CouponUsage.builder().coupon(coupon).user(user).order(order).build();
            couponUsageRepository.save(usage);
        }

        // For COD, mark as confirmed immediately
        if ("COD".equals(request.getPaymentMethod())) {
            order.setStatus(Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);

            // Create COD payment record
            Payment payment = Payment.builder()
                    .order(order)
                    .user(user)
                    .paymentGateway(Payment.PaymentGateway.COD)
                    .amount(total)
                    .currency("INR")
                    .status(Payment.PaymentDbStatus.AUTHORIZED)
                    .paymentMethodType(Payment.PaymentMethodType.COD)
                    .build();
            paymentRepository.save(payment);
        }

        // Clear cart
        cartItemRepository.deleteByCartId(cart.getId());

        // Send confirmation email
        emailService.sendOrderConfirmationEmail(
                user.getEmail(), user.getName(), orderNumber,
                total.toString(), "");

        log.info("Order placed: {} by user: {}", orderNumber, user.getEmail());
        return mapToOrderResponse(order, orderItems);
    }

    // ═══════════════════════════════════
    // GET USER ORDERS
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public Page<OrderDto.OrderListItem> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToOrderListItem);
    }

    // ═══════════════════════════════════
    // GET ORDER DETAIL
    // ═══════════════════════════════════
    @Transactional(readOnly = true)
    public OrderDto.OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        return mapToOrderResponse(order, items);
    }

    @Transactional(readOnly = true)
    public OrderDto.OrderResponse getOrderByNumber(String orderNumber, Long userId) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to you");
        }
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        return mapToOrderResponse(order, items);
    }

    // ═══════════════════════════════════
    // CANCEL ORDER
    // ═══════════════════════════════════
    @Transactional
    public OrderDto.OrderResponse cancelOrder(Long orderId, Long userId, String reason) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getStatus() == Order.OrderStatus.DELIVERED ||
                order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel this order");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancellationReason(reason);
        order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        orderRepository.save(order);

        // Restore stock
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        for (OrderItem item : items) {
            item.setItemStatus(Order.OrderStatus.CANCELLED);
            orderItemRepository.save(item);
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        log.info("Order cancelled: {}", order.getOrderNumber());
        return mapToOrderResponse(order, items);
    }

    // ═══════════════════════════════════
    // MAPPERS
    // ═══════════════════════════════════
    private OrderDto.OrderResponse mapToOrderResponse(Order order, List<OrderItem> items) {
        OrderDto.AddressResponse address = OrderDto.AddressResponse.builder()
                .fullName(order.getShippingName())
                .phone(order.getShippingPhone())
                .addressLine1(order.getShippingAddress())
                .city(order.getShippingCity())
                .state(order.getShippingState())
                .pincode(order.getShippingPincode())
                .build();

        List<OrderDto.OrderItemResponse> itemResponses = items.stream()
                .map(item -> OrderDto.OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productTitle(item.getProductTitle())
                        .productImage(item.getProductImage())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .totalPrice(item.getTotalPrice())
                        .itemStatus(item.getItemStatus().name())
                        .sellerName(item.getSeller() != null ? item.getSeller().getBusinessName() : null)
                        .build())
                .collect(Collectors.toList());

        return OrderDto.OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .taxAmount(order.getTaxAmount())
                .shippingAmount(order.getShippingAmount())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus().name())
                .couponCode(order.getCouponCode())
                .shippingAddress(address)
                .items(itemResponses)
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .createdAt(order.getCreatedAt())
                .deliveredAt(order.getDeliveredAt())
                .build();
    }

    private OrderDto.OrderListItem mapToOrderListItem(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        return OrderDto.OrderListItem.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .itemCount(items.size())
                .firstItemImage(items.isEmpty() ? null : items.get(0).getProductImage())
                .firstItemTitle(items.isEmpty() ? null : items.get(0).getProductTitle())
                .createdAt(order.getCreatedAt())
                .expectedDeliveryDate(order.getExpectedDeliveryDate())
                .build();
    }
}
