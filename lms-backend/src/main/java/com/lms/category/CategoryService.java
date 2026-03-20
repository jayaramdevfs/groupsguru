package com.lms.category;

import com.lms.category.dto.CategoryRequest;
import com.lms.category.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findByIsDeletedFalse().stream()
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
                .isDeleted(false)
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
}
