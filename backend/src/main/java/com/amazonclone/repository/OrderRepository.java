package com.amazonclone.repository;

import com.amazonclone.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByOrderNumber(String orderNumber);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    
    List<Order> findByStatusAndCreatedAtBefore(Order.OrderStatus status, LocalDateTime before);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.paymentStatus = 'PAID' AND o.createdAt >= :from")
    BigDecimal getRevenueAfter(LocalDateTime from);

    long countByStatus(Order.OrderStatus status);

    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :from")
    long countOrdersSince(LocalDateTime from);

    // For seller orders
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.seller.id = :sellerId ORDER BY o.createdAt DESC")
    Page<Order> findBySellerIdOrderByCreatedAtDesc(Long sellerId, Pageable pageable);

    @Query("SELECT SUM(i.totalPrice) FROM OrderItem i WHERE i.seller.id = :sellerId AND i.order.paymentStatus = 'PAID'")
    BigDecimal getSellerRevenue(Long sellerId);
}
