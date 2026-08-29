package com.amazonclone.repository;

import com.amazonclone.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByGatewayOrderId(String gatewayOrderId);
    Optional<Payment> findByTransactionId(String transactionId);
    Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId);
    List<Payment> findByUserId(Long userId);
    List<Payment> findByOrderUserIdOrderByCreatedAtDesc(Long userId);
}
