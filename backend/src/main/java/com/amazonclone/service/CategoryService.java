package com.amazonclone.service;

import com.amazonclone.dto.ApiResponse;
import com.amazonclone.entity.Category;
import com.amazonclone.exception.GlobalExceptionHandler.ResourceNotFoundException;
import com.amazonclone.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<ApiResponse.CategoryTree> getCategoryTree() {
        List<Category> rootCategories = categoryRepository.findByParentIsNullAndIsActiveTrueOrderBySortOrder();
        return rootCategories.stream().map(this::mapToCategoryTree).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApiResponse.CategoryTree> getSubcategories(Long parentId) {
        List<Category> categories = categoryRepository.findByParentIdAndIsActiveTrueOrderBySortOrder(parentId);
        return categories.stream().map(this::mapToCategoryTree).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApiResponse.CategoryTree getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return mapToCategoryTree(category);
    }

    private ApiResponse.CategoryTree mapToCategoryTree(Category category) {
        return ApiResponse.CategoryTree.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .imageUrl(category.getImageUrl())
                .children(category.getChildren() != null ? category.getChildren().stream()
                        .filter(Category::getIsActive)
                        .map(this::mapToCategoryTree)
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
