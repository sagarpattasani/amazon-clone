package com.amazonclone.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class ApiResponse {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Success<T> {
        @Builder.Default
        private boolean success = true;
        private String message;
        private T data;

        public static <T> Success<T> of(T data) {
            return Success.<T>builder().data(data).build();
        }

        public static <T> Success<T> of(T data, String message) {
            return Success.<T>builder().data(data).message(message).build();
        }

        public static Success<Void> message(String message) {
            return Success.<Void>builder().message(message).build();
        }
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Error {
        @Builder.Default
        private boolean success = false;
        private String message;
        private String error;
        private Integer status;
        private Map<String, String> fieldErrors;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PagedResponse<T> {
        private List<T> content;
        private Integer page;
        private Integer size;
        private Long totalElements;
        private Integer totalPages;
        private Boolean first;
        private Boolean last;
    }

    // ═══ Dashboard Stats ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AdminDashboard {
        private Long totalUsers;
        private Long totalOrders;
        private Long totalProducts;
        private Long totalSellers;
        private BigDecimal totalRevenue;
        private BigDecimal todayRevenue;
        private Long pendingOrders;
        private Long pendingReturns;
        private List<Map<String, Object>> recentOrders;
        private List<Map<String, Object>> revenueChart;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SellerDashboard {
        private Long totalProducts;
        private Long totalOrders;
        private BigDecimal totalEarnings;
        private BigDecimal monthlyEarnings;
        private BigDecimal rating;
        private Long pendingOrders;
        private List<Map<String, Object>> recentOrders;
        private List<Map<String, Object>> topProducts;
    }

    // ═══ Category Tree ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CategoryTree {
        private Long id;
        private String name;
        private String slug;
        private String imageUrl;
        private List<CategoryTree> children;
    }

    // ═══ Notification ═══
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class NotificationResponse {
        private Long id;
        private String type;
        private String title;
        private String message;
        private Boolean isRead;
        private String actionUrl;
        private String createdAt;
    }
}
