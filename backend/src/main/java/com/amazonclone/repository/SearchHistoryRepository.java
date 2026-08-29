package com.amazonclone.repository;

import com.amazonclone.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    @Query("SELECT DISTINCT s.query FROM SearchHistory s WHERE LOWER(s.query) LIKE LOWER(CONCAT('%', :prefix, '%')) ORDER BY s.query")
    List<String> findSuggestions(String prefix);
    
    List<SearchHistory> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT s.query, COUNT(s) as cnt FROM SearchHistory s GROUP BY s.query ORDER BY cnt DESC")
    List<Object[]> findTrendingSearches();
}
