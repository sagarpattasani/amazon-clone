package com.amazonclone.repository;

import com.amazonclone.entity.ProductRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {
    Page<ProductRating> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    Optional<ProductRating> findByProductIdAndUserId(Long productId, Long userId);
    boolean existsByProductIdAndUserId(Long productId, Long userId);
    
    @Query("SELECT AVG(r.rating) FROM ProductRating r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(Long productId);
    
    @Query("SELECT COUNT(r) FROM ProductRating r WHERE r.product.id = :productId")
    long countByProductId(Long productId);
    
    Page<ProductRating> findByProductIdAndRatingOrderByCreatedAtDesc(Long productId, Integer rating, Pageable pageable);
}
