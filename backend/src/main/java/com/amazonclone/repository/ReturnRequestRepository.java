package com.amazonclone.repository;

import com.amazonclone.entity.ReturnRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    Page<ReturnRequest> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<ReturnRequest> findByUserId(Long userId, Pageable pageable);
    Optional<ReturnRequest> findByOrderItemId(Long orderItemId);
    boolean existsByOrderItemId(Long orderItemId);
    Page<ReturnRequest> findByStatus(ReturnRequest.ReturnStatus status, Pageable pageable);
    Page<ReturnRequest> findByStatusOrderByCreatedAtDesc(ReturnRequest.ReturnStatus status, Pageable pageable);
    long countByStatus(ReturnRequest.ReturnStatus status);
}

