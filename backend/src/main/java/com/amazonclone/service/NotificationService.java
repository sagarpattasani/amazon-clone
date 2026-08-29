package com.amazonclone.service;

import com.amazonclone.entity.Notification;
import com.amazonclone.entity.User;
import com.amazonclone.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    /**
     * Send a real-time notification to a specific user via WebSocket
     * and persist it in the database.
     */
    @Async
    @Transactional
    public void sendNotification(Long userId, String title, String message, String type, String actionUrl) {
        User user = new User();
        user.setId(userId);

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .actionUrl(actionUrl)
                .isRead(false)
                .build();
        notification = notificationRepository.save(notification);

        // Send via WebSocket to the user
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", notification.getId());
        payload.put("title", title);
        payload.put("message", message);
        payload.put("type", type);
        payload.put("link", actionUrl);
        payload.put("isRead", false);
        payload.put("createdAt", notification.getCreatedAt().toString());

        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(), "/queue/notifications", payload);
            log.info("WebSocket notification sent to user {}: {}", userId, title);
        } catch (Exception e) {
            log.warn("Failed to send WebSocket notification to user {}: {}", userId, e.getMessage());
        }
    }

    /** Send order-related notification */
    public void sendOrderNotification(Long userId, String orderNumber, String status) {
        String title, message;
        switch (status) {
            case "CONFIRMED" -> { title = "Order Confirmed! ✅"; message = "Your order #" + orderNumber + " has been confirmed."; }
            case "SHIPPED" -> { title = "Order Shipped! 📦"; message = "Your order #" + orderNumber + " has been shipped."; }
            case "OUT_FOR_DELIVERY" -> { title = "Out for Delivery! 🚚"; message = "Your order #" + orderNumber + " is out for delivery."; }
            case "DELIVERED" -> { title = "Order Delivered! 🎉"; message = "Your order #" + orderNumber + " has been delivered."; }
            case "CANCELLED" -> { title = "Order Cancelled ❌"; message = "Your order #" + orderNumber + " has been cancelled."; }
            default -> { title = "Order Update"; message = "Your order #" + orderNumber + " status: " + status; }
        }
        sendNotification(userId, title, message, "ORDER", "/account/orders");
    }

    /** Send payment notification */
    public void sendPaymentNotification(Long userId, String orderNumber, String amount) {
        sendNotification(userId, "Payment Successful! 💳",
                "Payment of ₹" + amount + " for order #" + orderNumber + " was successful.",
                "PAYMENT", "/account/orders");
    }

    /** Send return/refund notification */
    public void sendReturnNotification(Long userId, String orderNumber, String action) {
        String title = action.equals("APPROVED") ? "Return Approved ✅" : "Refund Processed 💰";
        String message = action.equals("APPROVED")
                ? "Your return request for order #" + orderNumber + " has been approved."
                : "Refund for order #" + orderNumber + " has been processed.";
        sendNotification(userId, title, message, "RETURN", "/account/orders");
    }

    /** Broadcast a deal to all connected users */
    public void broadcastDeal(String title, String message, String link) {
        Map<String, Object> payload = Map.of("title", title, "message", message, "type", "PROMO", "link", link);
        messagingTemplate.convertAndSend("/topic/deals", payload);
        log.info("Broadcast deal: {}", title);
    }

    /** Get user notifications */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUserNotifications(Long userId, int limit) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .limit(limit)
                .map(n -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", n.getId());
                    map.put("title", n.getTitle());
                    map.put("message", n.getMessage());
                    map.put("type", n.getType());
                    map.put("link", n.getActionUrl());
                    map.put("isRead", n.getIsRead());
                    map.put("createdAt", n.getCreatedAt().toString());
                    return map;
                }).toList();
    }

    /** Mark notification as read */
    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUser().getId().equals(userId)) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        });
    }

    /** Mark all as read */
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .forEach(n -> { n.setIsRead(true); notificationRepository.save(n); });
    }

    /** Get unread count */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
}
