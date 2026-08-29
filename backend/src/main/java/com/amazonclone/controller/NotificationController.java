package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.security.CustomUserDetails;
import com.amazonclone.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<Map<String, Object>>>> getNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(ApiResponse.Success.of(
                notificationService.getUserNotifications(userDetails.getId(), limit)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse.Success<Map<String, Object>>> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        long count = notificationService.getUnreadCount(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.Success.of(Map.of("count", count)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse.Success<String>> markAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id) {
        notificationService.markAsRead(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.Success.of("Marked as read", "Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse.Success<String>> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.Success.of("All marked as read", "All notifications marked as read"));
    }
}
