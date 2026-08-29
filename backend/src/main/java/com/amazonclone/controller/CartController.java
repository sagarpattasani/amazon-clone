package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.OrderDto;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<OrderDto.CartResponse>> getCart(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.Success.of(cartService.getCart(userDetails.getId())));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse.Success<OrderDto.CartResponse>> addToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody OrderDto.AddToCartRequest request) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                cartService.addToCart(userDetails.getId(), request), "Item added to cart"));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<ApiResponse.Success<OrderDto.CartResponse>> updateCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody OrderDto.UpdateCartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                cartService.updateCartItem(userDetails.getId(), id, request)));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<ApiResponse.Success<OrderDto.CartResponse>> removeCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                cartService.removeCartItem(userDetails.getId(), id), "Item removed from cart"));
    }

    @PostMapping("/save-for-later/{id}")
    public ResponseEntity<ApiResponse.Success<OrderDto.CartResponse>> saveForLater(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                cartService.saveForLater(userDetails.getId(), id), "Item saved for later"));
    }

    @PostMapping("/move-to-cart/{id}")
    public ResponseEntity<ApiResponse.Success<OrderDto.CartResponse>> moveToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                cartService.moveToCart(userDetails.getId(), id), "Item moved to cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse.Success<Void>> clearCart(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.Success.message("Cart cleared"));
    }
}
