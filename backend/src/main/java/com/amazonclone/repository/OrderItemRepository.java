package com.amazonclone.repository;

import com.amazonclone.entity.Order;
import com.amazonclone.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findBySellerId(Long sellerId);
    List<OrderItem> findByOrderIdAndSellerId(Long orderId, Long sellerId);

    long countByOrderId(Long orderId);
    long countBySellerId(Long sellerId);
    long countBySellerIdAndItemStatus(Long sellerId, Order.OrderStatus status);

    Page<OrderItem> findBySellerId(Long sellerId, Pageable pageable);
    Page<OrderItem> findBySellerIdOrderByCreatedAtDesc(Long sellerId, Pageable pageable);

    @Query("SELECT SUM(i.totalPrice) FROM OrderItem i WHERE i.seller.id = :sellerId")
    BigDecimal getTotalEarningsBySellerId(Long sellerId);

}

