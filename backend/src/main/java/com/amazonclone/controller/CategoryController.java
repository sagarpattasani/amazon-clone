package com.amazonclone.controller;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse.Success<List<ApiResponse.CategoryTree>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.Success.of(categoryService.getCategoryTree()));
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<ApiResponse.Success<List<ApiResponse.CategoryTree>>> getSubcategories(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.Success.of(categoryService.getSubcategories(id)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse.Success<ApiResponse.CategoryTree>> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.Success.of(categoryService.getCategoryBySlug(slug)));
    }
}
