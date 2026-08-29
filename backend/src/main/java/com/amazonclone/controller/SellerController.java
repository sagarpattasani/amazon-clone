package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.ProductDto;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.ProductService;
import com.amazonclone.service.SellerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final ProductService productService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse.Success<ApiResponse.SellerDashboard>> getDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.Success.of(sellerService.getSellerDashboard(userDetails.getId())));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse.Success<Map<String, Object>>> registerSeller(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> body) {
        Map<String, Object> seller = sellerService.registerSeller(
                userDetails.getId(), body.get("businessName"), body.get("gstNumber"), body.get("description"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.Success.of(seller, "Seller registration successful"));
    }

    @GetMapping("/products")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<ProductDto.ProductListItem>>> getProducts(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ProductDto.ProductListItem> products = sellerService.getSellerProducts(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.Success.of(ApiResponse.PagedResponse.<ProductDto.ProductListItem>builder()
                .content(products.getContent()).page(products.getNumber()).size(products.getSize())
                .totalElements(products.getTotalElements()).totalPages(products.getTotalPages())
                .first(products.isFirst()).last(products.isLast()).build()));
    }

    @PostMapping("/products")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse.Success<ProductDto.ProductResponse>> createProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ProductDto.CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.Success.of(productService.createProduct(request, userDetails.getId()), "Product created"));
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse.Success<Void>> updateProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ProductDto.CreateProductRequest request) {
        sellerService.updateProduct(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.Success.message("Product updated"));
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse.Success<Void>> deleteProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        sellerService.deleteProduct(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.Success.message("Product deleted"));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<Map<String, Object>>>> getOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Map<String, Object>> orders = sellerService.getSellerOrders(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.Success.of(ApiResponse.PagedResponse.<Map<String, Object>>builder()
                .content(orders.getContent()).page(orders.getNumber()).size(orders.getSize())
                .totalElements(orders.getTotalElements()).totalPages(orders.getTotalPages())
                .first(orders.isFirst()).last(orders.isLast()).build()));
    }
}
