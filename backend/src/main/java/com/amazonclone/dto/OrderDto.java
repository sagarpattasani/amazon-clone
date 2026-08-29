package com.amazonclone.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class OrderDto {

    // ═══ Cart ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CartResponse {
        private Long cartId;
        private List<CartItemResponse> items;
        private List<CartItemResponse> savedForLater;
        private BigDecimal subtotal;
        private Integer totalItems;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productTitle;
        private String productImage;
        private String brand;
        private BigDecimal price;
        private BigDecimal mrp;
        private Integer discountPercent;
        private Integer quantity;
        private Boolean inStock;
        private Integer availableStock;
        private Long variantId;
        private String variantName;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class AddToCartRequest {
        @NotNull private Long productId;
        private Long variantId;
        @Min(1) private Integer quantity = 1;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class UpdateCartItemRequest {
        @NotNull @Min(1) @Max(10) private Integer quantity;
    }

    // ═══ Checkout ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CheckoutRequest {
        @NotNull private Long addressId;
        @NotBlank private String paymentMethod; // STRIPE, RAZORPAY, COD, UPI
        private String couponCode;
        private String notes;
        private String paymentMethodType; // CARD, UPI, NETBANKING, WALLET, COD
    }

    // ═══ Order Response ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderResponse {
        private Long id;
        private String orderNumber;
        private String status;
        private BigDecimal totalAmount;
        private BigDecimal subtotalAmount;
        private BigDecimal discountAmount;
        private BigDecimal taxAmount;
        private BigDecimal shippingAmount;
        private String paymentMethod;
        private String paymentStatus;
        private String couponCode;
        private AddressResponse shippingAddress;
        private List<OrderItemResponse> items;
        private LocalDate expectedDeliveryDate;
        private LocalDateTime createdAt;
        private LocalDateTime deliveredAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productTitle;
        private String productImage;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;
        private String itemStatus;
        private String sellerName;
        private Long variantId;
        private String variantName;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OrderListItem {
        private Long id;
        private String orderNumber;
        private String status;
        private BigDecimal totalAmount;
        private Integer itemCount;
        private String firstItemImage;
        private String firstItemTitle;
        private LocalDateTime createdAt;
        private LocalDate expectedDeliveryDate;
    }

    // ═══ Address ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AddressResponse {
        private Long id;
        private String fullName;
        private String phone;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String pincode;
        private String country;
        private Boolean isDefault;
        private String addressType;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CreateAddressRequest {
        @NotBlank private String fullName;
        @NotBlank private String phone;
        @NotBlank private String addressLine1;
        private String addressLine2;
        @NotBlank private String city;
        @NotBlank private String state;
        @NotBlank @Size(min = 5, max = 10) private String pincode;
        private String country = "India";
        private Boolean isDefault = false;
        private String addressType = "HOME";
    }

    // ═══ Payment ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PaymentIntentResponse {
        private String gatewayOrderId;
        private String clientSecret;
        private BigDecimal amount;
        private String currency;
        private String gateway;
        private String orderId;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class PaymentConfirmRequest {
        @NotBlank private String gatewayOrderId;
        @NotBlank private String gatewayPaymentId;
        private String gatewaySignature;
    }

    // ═══ Delivery Tracking ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TrackingResponse {
        private String trackingNumber;
        private String courierName;
        private String currentStatus;
        private String currentLocation;
        private LocalDate estimatedDelivery;
        private List<Map<String, Object>> timeline;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DeliveryEstimateResponse {
        private String pincode;
        private LocalDate estimatedDate;
        private BigDecimal deliveryCharge;
        private Boolean freeDelivery;
        private String deliverySpeed;
    }

    // ═══ Return ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ReturnRequestDto {
        @NotNull private Long orderItemId;
        @NotBlank private String reason;
        private String description;
        private List<String> images;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ReturnResponse {
        private Long id;
        private Long orderItemId;
        private String productTitle;
        private String productImage;
        private String reason;
        private String description;
        private String status;
        private BigDecimal refundAmount;
        private LocalDate pickupDate;
        private LocalDateTime createdAt;
    }

    // ═══ Cancel Order ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CancelOrderRequest {
        private String reason;
    }

    // ═══ Coupon ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class ApplyCouponRequest {
        @NotBlank private String code;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CouponResponse {
        private String code;
        private String description;
        private String discountType;
        private BigDecimal discountValue;
        private BigDecimal discountApplied;
        private BigDecimal minOrderAmount;
        private BigDecimal maxDiscount;
    }
}
