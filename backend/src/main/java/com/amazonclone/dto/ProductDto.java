package com.amazonclone.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDto {

    // ═══ Product Response ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProductResponse {
        private Long id;
        private String title;
        private String description;
        private String about;
        private List<String> bulletPoints;
        private String brand;
        private CategoryInfo category;
        private SellerInfo seller;
        private BigDecimal price;
        private BigDecimal mrp;
        private Integer discountPercent;
        private Integer stockQuantity;
        private String sku;
        private BigDecimal weight;
        private String dimensions;
        private Boolean isFeatured;
        private Boolean isDealOfDay;
        private BigDecimal avgRating;
        private Integer totalRatings;
        private Integer totalReviews;
        private List<ImageInfo> images;
        private List<VariantInfo> variants;
        private Boolean inWishlist;
        private LocalDateTime createdAt;
    }

    // ═══ Product List Item ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProductListItem {
        private Long id;
        private String title;
        private String brand;
        private BigDecimal price;
        private BigDecimal mrp;
        private Integer discountPercent;
        private BigDecimal avgRating;
        private Integer totalRatings;
        private String primaryImage;
        private Boolean isFeatured;
        private Boolean inStock;
    }

    // ═══ Create / Update Product ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CreateProductRequest {
        @NotBlank private String title;
        private String description;
        private String about;
        private List<String> bulletPoints;
        private String brand;
        @NotNull private Long categoryId;
        @NotNull @DecimalMin("0.01") private BigDecimal price;
        private BigDecimal mrp;
        private Integer discountPercent;
        @Min(0) private Integer stockQuantity;
        private String sku;
        private BigDecimal weight;
        private String dimensions;
        private Boolean isFeatured;
        private List<String> imageUrls;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateProductRequest {
        private String title;
        private String description;
        private String about;
        private List<String> bulletPoints;
        private String brand;
        private Long categoryId;
        private BigDecimal price;
        private BigDecimal mrp;
        private Integer discountPercent;
        private Integer stockQuantity;
        private Boolean isFeatured;
        private Boolean isDealOfDay;
    }

    // ═══ Nested Info Classes ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SellerInfo {
        private Long id;
        private String businessName;
        private BigDecimal rating;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ImageInfo {
        private Long id;
        private String imageUrl;
        private Boolean isPrimary;
        private Integer sortOrder;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class VariantInfo {
        private Long id;
        private String variantName;
        private String color;
        private String size;
        private String storage;
        private BigDecimal priceModifier;
        private Integer stock;
        private String imageUrl;
    }

    // ═══ Review ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ReviewResponse {
        private Long id;
        private String userName;
        private String userProfilePic;
        private Integer rating;
        private String reviewTitle;
        private String reviewBody;
        private List<String> reviewImages;
        private Boolean verifiedPurchase;
        private Integer helpfulVotes;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CreateReviewRequest {
        @NotNull @Min(1) @Max(5) private Integer rating;
        @Size(max = 200) private String reviewTitle;
        @Size(max = 5000) private String reviewBody;
        private List<String> reviewImages;
    }

    // ═══ Search / Filter ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ProductFilter {
        private Long categoryId;
        private String brand;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private Integer minRating;
        private Integer minDiscount;
        private String sortBy; // price_asc, price_desc, rating, newest, popularity
        private String query;
        private Integer page;
        private Integer size;
    }
}
