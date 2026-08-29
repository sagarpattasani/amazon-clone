package com.amazonclone.repository;

import com.amazonclone.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeAndIsActiveTrue(String code);
    Optional<Coupon> findByCode(String code);
    List<Coupon> findByIsActiveTrueAndValidToAfter(LocalDateTime now);
    List<Coupon> findByIsActiveTrueAndValidToBefore(LocalDateTime now);
}
