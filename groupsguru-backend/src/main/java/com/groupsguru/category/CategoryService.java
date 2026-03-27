package com.groupsguru.category;

import com.groupsguru.category.dto.CategoryRequest;
import com.groupsguru.category.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories(Long commissionId, boolean isAdmin) {
        List<Category> categories;
        if (commissionId != null) {
            categories = isAdmin
                ? categoryRepository.findByCommissionIdAndIsDeletedFalseOrderByDisplayOrderAsc(commissionId)
                : categoryRepository.findByCommissionIdAndIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc(commissionId);
        } else {
            categories = isAdmin
                ? categoryRepository.findByIsDeletedFalseOrderByDisplayOrderAsc()
                : categoryRepository.findByIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc();
        }

        return categories.stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = getEntityById(id);
        return CategoryResponse.fromEntity(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .nameTe(request.getNameTe())
                .description(request.getDescription())
                .descriptionTe(request.getDescriptionTe())
                .imageUrl(request.getImageUrl())
                .commissionId(request.getCommissionId() != null ? request.getCommissionId() : 1L)
                .isDeleted(false)
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .accessType(request.getAccessType() != null ? request.getAccessType() : "FREE")
                .priceInr(request.getPriceInr() != null ? request.getPriceInr() : 0.0)
                .build();
        
        Category saved = categoryRepository.save(category);
        return CategoryResponse.fromEntity(saved);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = getEntityById(id);
        
        if (request.getName() != null && !request.getName().isBlank()) {
            category.setName(request.getName());
        }
        if (request.getNameTe() != null && !request.getNameTe().isBlank()) {
            category.setNameTe(request.getNameTe());
        }
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }
        if (request.getDescriptionTe() != null) {
            category.setDescriptionTe(request.getDescriptionTe());
        }
        if (request.getImageUrl() != null) {
            category.setImageUrl(request.getImageUrl());
        }
        if (request.getCommissionId() != null) {
            category.setCommissionId(request.getCommissionId());
        }
        if (request.getIsPublished() != null) {
            category.setPublished(request.getIsPublished());
        }
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getAccessType() != null) {
            category.setAccessType(request.getAccessType());
        }
        if (request.getPriceInr() != null) {
            category.setPriceInr(request.getPriceInr());
        }
        
        Category updated = categoryRepository.save(category);
        return CategoryResponse.fromEntity(updated);
    }

    public void softDeleteCategory(Long id) {
        Category category = getEntityById(id);
        category.setDeleted(true);
        categoryRepository.save(category);
    }

    private Category getEntityById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (category.isDeleted()) {
            throw new RuntimeException("Category not found");
        }
        return category;
    }

    @org.springframework.transaction.annotation.Transactional
    public CategoryResponse togglePublish(Long id) {
        Category category = getEntityById(id);
        category.setPublished(!category.isPublished());
        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }

    @org.springframework.transaction.annotation.Transactional
    public void reorder(List<java.util.Map<String, Object>> items) {
        for (java.util.Map<String, Object> item : items) {
            Long id = Long.valueOf(item.get("id").toString());
            Integer displayOrder = Integer.valueOf(item.get("displayOrder").toString());
            categoryRepository.findById(id).ifPresent(cat -> {
                cat.setDisplayOrder(displayOrder);
                categoryRepository.save(cat);
            });
        }
    }
}
