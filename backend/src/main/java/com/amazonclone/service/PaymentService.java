package com.amazonclone.service;

import com.amazonclone.entity.*;
import com.amazonclone.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.amazonclone.repository.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Value("${app.razorpay.key-id:}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:}")
    private String razorpayKeySecret;

    /**
     * Create a Razorpay order for online payment.
     */
    @Transactional
    public Map<String, Object> initiatePayment(Long userId, Long orderId, String gateway) {
        com.amazonclone.entity.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        Map<String, Object> result = new HashMap<>();

        if ("RAZORPAY".equalsIgnoreCase(gateway) && !razorpayKeyId.isBlank()) {
            // Real Razorpay integration
            try {
                RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).intValue()); // paise
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", order.getOrderNumber());
                orderRequest.put("notes", new JSONObject().put("orderId", orderId));

                Order razorpayOrder = razorpay.orders.create(orderRequest);

                // Save payment record
                Payment payment = Payment.builder()
                        .order(order).user(order.getUser()).paymentGateway(Payment.PaymentGateway.RAZORPAY).paymentMethodType(Payment.PaymentMethodType.CARD)
                        .transactionId(razorpayOrder.get("id"))
                        .amount(order.getTotalAmount())
                        .status(Payment.PaymentDbStatus.CREATED)
                        .createdAt(LocalDateTime.now())
                        .build();
                paymentRepository.save(payment);

                result.put("razorpayOrderId", razorpayOrder.get("id"));
                result.put("razorpayKeyId", razorpayKeyId);
                result.put("amount", order.getTotalAmount());
                result.put("currency", "INR");
                result.put("orderId", orderId);
                result.put("orderNumber", order.getOrderNumber());
                result.put("status", "CREATED");

                log.info("Razorpay order created: {} for order #{}", razorpayOrder.get("id"), order.getOrderNumber());

            } catch (RazorpayException e) {
                log.error("Razorpay error: {}", e.getMessage());
                throw new RuntimeException("Payment gateway error: " + e.getMessage());
            }
        } else {
            // Mock payment for testing (when no Razorpay keys configured)
            String mockTxnId = "mock_" + UUID.randomUUID().toString().substring(0, 12);

            Payment payment = Payment.builder()
                    .order(order).user(order.getUser()).paymentGateway(Payment.PaymentGateway.RAZORPAY).paymentMethodType(Payment.PaymentMethodType.CARD)
                    .transactionId(mockTxnId)
                    .amount(order.getTotalAmount())
                    .status(Payment.PaymentDbStatus.CREATED)
                    .createdAt(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment);

            result.put("razorpayOrderId", mockTxnId);
            result.put("razorpayKeyId", "mock_key");
            result.put("amount", order.getTotalAmount());
            result.put("currency", "INR");
            result.put("orderId", orderId);
            result.put("orderNumber", order.getOrderNumber());
            result.put("status", "MOCK_CREATED");
            result.put("message", "Mock mode - Razorpay keys not configured");
        }

        return result;
    }

    /**
     * Verify Razorpay payment signature and confirm payment.
     */
    @Transactional
    public Map<String, Object> confirmPayment(Long userId, String razorpayOrderId,
                                              String razorpayPaymentId, String razorpaySignature) {
        Payment payment = paymentRepository.findByTransactionId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        com.amazonclone.entity.Order order = payment.getOrder();
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        boolean verified = false;

        if (!razorpayKeySecret.isBlank() && !razorpayOrderId.startsWith("mock_")) {
            // Real Razorpay signature verification
            try {
                JSONObject attributes = new JSONObject();
                attributes.put("razorpay_order_id", razorpayOrderId);
                attributes.put("razorpay_payment_id", razorpayPaymentId);
                attributes.put("razorpay_signature", razorpaySignature);

                verified = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);
            } catch (RazorpayException e) {
                log.error("Razorpay verification failed: {}", e.getMessage());
            }
        } else {
            // Mock mode - auto-verify
            verified = true;
        }

        Map<String, Object> result = new HashMap<>();

        if (verified) {
            payment.setStatus(Payment.PaymentDbStatus.CAPTURED);
            payment.setGatewayPaymentId(razorpayPaymentId);
            payment.setUpdatedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            order.setPaymentStatus(com.amazonclone.entity.Order.PaymentStatus.PAID);
            order.setPaymentMethod(payment.getPaymentGateway().name());
            order.setStatus(com.amazonclone.entity.Order.OrderStatus.CONFIRMED);
            orderRepository.save(order);

            // Send notifications
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                emailService.sendOrderConfirmationEmail(user.getEmail(), user.getName(),
                        order.getOrderNumber(), "₹" + order.getTotalAmount().toPlainString(), "Payment confirmed");
                notificationService.sendPaymentNotification(userId, order.getOrderNumber(),
                        order.getTotalAmount().toPlainString());
                notificationService.sendOrderNotification(userId, order.getOrderNumber(), "CONFIRMED");
            }

            result.put("status", "SUCCESS");
            result.put("orderId", order.getId());
            result.put("orderNumber", order.getOrderNumber());
            result.put("message", "Payment verified successfully");

            log.info("Payment verified for order #{}", order.getOrderNumber());
        } else {
            payment.setStatus(Payment.PaymentDbStatus.FAILED);
            paymentRepository.save(payment);

            result.put("status", "FAILED");
            result.put("message", "Payment verification failed");
        }

        return result;
    }

    /**
     * Process COD (Cash on Delivery) payment.
     */
    @Transactional
    public Map<String, Object> confirmCOD(Long userId, Long orderId) {
        com.amazonclone.entity.Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        Payment payment = Payment.builder()
                .order(order).user(order.getUser()).paymentGateway(Payment.PaymentGateway.COD).paymentMethodType(Payment.PaymentMethodType.COD)
                .transactionId("COD_" + order.getOrderNumber())
                .amount(order.getTotalAmount())
                .status(Payment.PaymentDbStatus.CREATED)
                .createdAt(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        order.setPaymentMethod("COD");
        order.setPaymentStatus(com.amazonclone.entity.Order.PaymentStatus.PENDING);
        order.setStatus(com.amazonclone.entity.Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Notifications
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            emailService.sendOrderConfirmationEmail(user.getEmail(), user.getName(),
                    order.getOrderNumber(), "₹" + order.getTotalAmount().toPlainString(), "Cash on Delivery");
            notificationService.sendOrderNotification(userId, order.getOrderNumber(), "CONFIRMED");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("status", "SUCCESS");
        result.put("orderId", order.getId());
        result.put("orderNumber", order.getOrderNumber());
        result.put("paymentMethod", "COD");
        result.put("message", "COD order confirmed. Pay on delivery.");

        return result;
    }

    /**
     * Get payment history for user.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPaymentHistory(Long userId) {
        return paymentRepository.findByOrderUserIdOrderByCreatedAtDesc(userId).stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId());
                    map.put("orderId", p.getOrder().getId());
                    map.put("orderNumber", p.getOrder().getOrderNumber());
                    map.put("gateway", p.getPaymentGateway().name());
                    map.put("amount", p.getAmount());
                    map.put("status", p.getStatus().name());
                    map.put("transactionId", p.getTransactionId());
                    map.put("createdAt", p.getCreatedAt());
                    return map;
                }).toList();
    }
}
