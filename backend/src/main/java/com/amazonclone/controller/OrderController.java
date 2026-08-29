package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.OrderDto;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse.Success<OrderDto.OrderResponse>> checkout(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody OrderDto.CheckoutRequest request) {
        OrderDto.OrderResponse order = orderService.checkout(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.Success.of(order, "Order placed successfully!"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<OrderDto.OrderListItem>>> getOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrderDto.OrderListItem> orders = orderService.getUserOrders(userDetails.getId(), page, size);

        ApiResponse.PagedResponse<OrderDto.OrderListItem> pagedResponse = ApiResponse.PagedResponse.<OrderDto.OrderListItem>builder()
                .content(orders.getContent())
                .page(orders.getNumber())
                .size(orders.getSize())
                .totalElements(orders.getTotalElements())
                .totalPages(orders.getTotalPages())
                .first(orders.isFirst())
                .last(orders.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.Success.of(pagedResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<OrderDto.OrderResponse>> getOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                orderService.getOrderById(id, userDetails.getId())));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse.Success<OrderDto.OrderResponse>> getOrderByNumber(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String orderNumber) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                orderService.getOrderByNumber(orderNumber, userDetails.getId())));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse.Success<OrderDto.OrderResponse>> cancelOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody(required = false) OrderDto.CancelOrderRequest request) {
        String reason = request != null ? request.getReason() : "Customer requested cancellation";
        return ResponseEntity.ok(ApiResponse.Success.of(
                orderService.cancelOrder(id, userDetails.getId(), reason), "Order cancelled successfully"));
    }
}
