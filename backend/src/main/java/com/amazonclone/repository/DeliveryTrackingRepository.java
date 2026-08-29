package com.amazonclone.repository;

import com.amazonclone.entity.DeliveryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {
    Optional<DeliveryTracking> findByOrderItemId(Long orderItemId);
    Optional<DeliveryTracking> findByTrackingNumber(String trackingNumber);
    Optional<DeliveryTracking> findByOrderId(Long orderId);
}
