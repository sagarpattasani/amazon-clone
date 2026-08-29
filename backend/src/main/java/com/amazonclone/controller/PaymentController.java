package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse.Success<Map<String, Object>>> initiate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Object> body) {
        Long orderId = Long.valueOf(body.get("orderId").toString());
        String gateway = body.get("gateway") != null ? body.get("gateway").toString() : "RAZORPAY";
        return ResponseEntity.ok(ApiResponse.Success.of(
                paymentService.initiatePayment(userDetails.getId(), orderId, gateway), "Payment initiated"));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse.Success<Map<String, Object>>> confirm(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                paymentService.confirmPayment(userDetails.getId(),
                        body.get("gatewayOrderId"), body.get("gatewayPaymentId"), body.get("signature")),
                "Payment confirmed"));
    }

    @PostMapping("/cod")
    public ResponseEntity<ApiResponse.Success<Map<String, Object>>> confirmCOD(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, Object> body) {
        Long orderId = Long.valueOf(body.get("orderId").toString());
        return ResponseEntity.ok(ApiResponse.Success.of(
                paymentService.confirmCOD(userDetails.getId(), orderId), "Order confirmed with COD"));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse.Success<List<Map<String, Object>>>> history(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.Success.of(paymentService.getPaymentHistory(userDetails.getId())));
    }

    // Webhook endpoint (public, no auth) for gateway callbacks
    @PostMapping("/webhook/razorpay")
    public ResponseEntity<String> razorpayWebhook(@RequestBody String payload) {
        // In production: verify webhook signature, process events
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/webhook/stripe")
    public ResponseEntity<String> stripeWebhook(@RequestBody String payload) {
        return ResponseEntity.ok("OK");
    }
}
