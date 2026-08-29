package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.entity.Product;
import com.amazonclone.repository.ProductRepository;
import com.amazonclone.repository.SearchHistoryRepository;
import com.amazonclone.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ProductRepository productRepository;
    private final SearchHistoryRepository searchHistoryRepository;

    @GetMapping("/suggestions")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse.Success<Map<String, Object>>> getSuggestions(
            @RequestParam String q) {
        if (q == null || q.trim().length() < 2) {
            return ResponseEntity.ok(ApiResponse.Success.of(Map.of("products", List.of(), "brands", List.of())));
        }

        // Get matching products
        List<Map<String, Object>> products = productRepository
                .searchProducts(q.trim(), PageRequest.of(0, 8))
                .getContent().stream()
                .map(p -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", p.getId());
                    map.put("title", p.getTitle());
                    map.put("price", p.getPrice());
                    map.put("brand", p.getBrand());
                    map.put("category", p.getCategory() != null ? p.getCategory().getName() : null);
                    return map;
                }).collect(Collectors.toList());

        // Get matching brands
        List<String> brands = productRepository.findAllActiveBrands().stream()
                .filter(b -> b.toLowerCase().contains(q.trim().toLowerCase()))
                .limit(5)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("products", products);
        result.put("brands", brands);
        result.put("query", q);

        return ResponseEntity.ok(ApiResponse.Success.of(result));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse.Success<List<String>>> getTrending() {
        // Return trending search terms (mock for now)
        List<String> trending = List.of(
                "iPhone 15", "Samsung Galaxy", "Laptop", "Headphones",
                "Nike Shoes", "Watch", "Kurta", "Books"
        );
        return ResponseEntity.ok(ApiResponse.Success.of(trending));
    }
}
