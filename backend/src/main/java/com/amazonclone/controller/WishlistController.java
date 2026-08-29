package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.dto.ProductDto;
import com.amazonclone.entity.*;
import com.amazonclone.exception.GlobalExceptionHandler.*;
import com.amazonclone.repository.*;
import com.amazonclone.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<ProductDto.ProductListItem>>> getWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Wishlist> wishlistItems = wishlistRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());
        List<ProductDto.ProductListItem> products = wishlistItems.stream()
                .map(w -> {
                    Product p = w.getProduct();
                    String img = productImageRepository.findFirstByProductIdAndIsPrimaryTrue(p.getId())
                            .map(ProductImage::getImageUrl).orElse(null);
                    return ProductDto.ProductListItem.builder()
                            .id(p.getId()).title(p.getTitle()).brand(p.getBrand())
                            .price(p.getPrice()).mrp(p.getMrp()).discountPercent(p.getDiscountPercent())
                            .avgRating(p.getAvgRating()).totalRatings(p.getTotalRatings())
                            .primaryImage(img).inStock(p.isInStock()).build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.Success.of(products));
    }

    @PostMapping("/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse.Success<Void>> addToWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userDetails.getId(), productId)) {
            throw new DuplicateResourceException("Product already in wishlist");
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        User user = new User(); user.setId(userDetails.getId());
        wishlistRepository.save(Wishlist.builder().user(user).product(product).build());
        return ResponseEntity.ok(ApiResponse.Success.message("Added to wishlist"));
    }

    @DeleteMapping("/{productId}")
    @Transactional
    public ResponseEntity<ApiResponse.Success<Void>> removeFromWishlist(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long productId) {
        wishlistRepository.deleteByUserIdAndProductId(userDetails.getId(), productId);
        return ResponseEntity.ok(ApiResponse.Success.message("Removed from wishlist"));
    }
}
