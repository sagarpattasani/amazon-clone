package com.amazonclone.repository;

import com.amazonclone.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    Page<Product> findByIsActiveTrueAndCategoryId(Long categoryId, Pageable pageable);
    
    Page<Product> findByIsActiveTrueAndBrand(String brand, Pageable pageable);
    
    List<Product> findByIsActiveTrueAndIsFeaturedTrueOrderByCreatedAtDesc();
    
    List<Product> findByIsActiveTrueAndIsDealOfDayTrue();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category.id = :categoryId AND p.id != :productId ORDER BY p.avgRating DESC")
    List<Product> findSimilarProducts(@Param("categoryId") Long categoryId, @Param("productId") Long productId, Pageable pageable);
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.isActive = true AND p.brand IS NOT NULL ORDER BY p.brand")
    List<String> findAllActiveBrands();
    
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.isActive = true AND p.category.id = :categoryId AND p.brand IS NOT NULL ORDER BY p.brand")
    List<String> findBrandsByCategoryId(@Param("categoryId") Long categoryId);
    
    Page<Product> findBySellerIdAndIsActiveTrue(Long sellerId, Pageable pageable);
    
    long countByIsActiveTrue();
    long countBySellerIdAndIsActiveTrue(Long sellerId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.totalSold DESC")
    List<Product> findTopSellingProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category.id IN :categoryIds ORDER BY p.avgRating DESC")
    List<Product> findRecommendedProducts(@Param("categoryIds") List<Long> categoryIds, Pageable pageable);
}
