package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.ProductDto;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<ProductDto.ProductListItem>>> getProducts(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) Integer discount,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ProductDto.ProductFilter filter = ProductDto.ProductFilter.builder()
                .categoryId(category)
                .brand(brand)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .minRating(rating)
                .minDiscount(discount)
                .sortBy(sort)
                .query(q)
                .page(page)
                .size(size)
                .build();

        Page<ProductDto.ProductListItem> products = productService.getProducts(filter);

        ApiResponse.PagedResponse<ProductDto.ProductListItem> pagedResponse = ApiResponse.PagedResponse.<ProductDto.ProductListItem>builder()
                .content(products.getContent())
                .page(products.getNumber())
                .size(products.getSize())
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .first(products.isFirst())
                .last(products.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.Success.of(pagedResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse.Success<ProductDto.ProductResponse>> getProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        ProductDto.ProductResponse product = productService.getProductById(id, userId);
        return ResponseEntity.ok(ApiResponse.Success.of(product));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<ProductDto.ProductListItem>>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ProductDto.ProductListItem> products = productService.searchProducts(q, page, size);

        ApiResponse.PagedResponse<ProductDto.ProductListItem> pagedResponse = ApiResponse.PagedResponse.<ProductDto.ProductListItem>builder()
                .content(products.getContent())
                .page(products.getNumber())
                .size(products.getSize())
                .totalElements(products.getTotalElements())
                .totalPages(products.getTotalPages())
                .first(products.isFirst())
                .last(products.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.Success.of(pagedResponse));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse.Success<List<ProductDto.ProductListItem>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.Success.of(productService.getFeaturedProducts()));
    }

    @GetMapping("/deals-of-the-day")
    public ResponseEntity<ApiResponse.Success<List<ProductDto.ProductListItem>>> getDealsOfTheDay() {
        return ResponseEntity.ok(ApiResponse.Success.of(productService.getDealsOfTheDay()));
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<ApiResponse.Success<List<ProductDto.ProductListItem>>> getSimilarProducts(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.Success.of(productService.getSimilarProducts(id)));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse.Success<ApiResponse.PagedResponse<ProductDto.ReviewResponse>>> getReviews(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProductDto.ReviewResponse> reviews = productService.getProductReviews(id, page, size);

        ApiResponse.PagedResponse<ProductDto.ReviewResponse> pagedResponse = ApiResponse.PagedResponse.<ProductDto.ReviewResponse>builder()
                .content(reviews.getContent())
                .page(reviews.getNumber())
                .size(reviews.getSize())
                .totalElements(reviews.getTotalElements())
                .totalPages(reviews.getTotalPages())
                .first(reviews.isFirst())
                .last(reviews.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.Success.of(pagedResponse));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse.Success<ProductDto.ReviewResponse>> addReview(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ProductDto.CreateReviewRequest request) {
        ProductDto.ReviewResponse review = productService.addReview(id, userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.Success.of(review, "Review added successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse.Success<ProductDto.ProductResponse>> createProduct(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ProductDto.CreateProductRequest request) {
        ProductDto.ProductResponse product = productService.createProduct(request, userDetails.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.Success.of(product, "Product created"));
    }

    @GetMapping("/brands")
    public ResponseEntity<ApiResponse.Success<List<String>>> getBrands(
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(ApiResponse.Success.of(productService.getBrands(categoryId)));
    }
}
