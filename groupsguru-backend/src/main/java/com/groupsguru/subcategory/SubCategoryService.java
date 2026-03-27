package com.groupsguru.subcategory;

import com.groupsguru.category.Category;
import com.groupsguru.category.CategoryRepository;
import com.groupsguru.subcategory.dto.SubCategoryRequest;
import com.groupsguru.subcategory.dto.SubCategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<SubCategoryResponse> getAllSubCategories(boolean isAdmin) {
        List<SubCategory> items = isAdmin
                ? subCategoryRepository.findByIsDeletedFalseOrderByDisplayOrderAsc()
                : subCategoryRepository.findByIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc();
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubCategoryResponse> getSubCategoriesByCategory(Long categoryId, boolean isAdmin) {
        List<SubCategory> items = isAdmin
                ? subCategoryRepository.findByCategoryIdAndIsDeletedFalseOrderByDisplayOrderAsc(categoryId)
                : subCategoryRepository.findByCategoryIdAndIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc(categoryId);
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubCategoryResponse createSubCategory(SubCategoryRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        SubCategory subCategory = SubCategory.builder()
                .name(request.getName())
                .nameTe(request.getNameTe())
                .description(request.getDescription())
                .descriptionTe(request.getDescriptionTe())
                .syllabusCode(request.getSyllabusCode())
                .category(category)
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .accessType(request.getAccessType() != null ? request.getAccessType() : "FREE")
                .priceInr(request.getPriceInr() != null ? request.getPriceInr() : 0.0)
                .build();

        return mapToResponse(subCategoryRepository.save(subCategory));
    }

    @Transactional
    public SubCategoryResponse updateSubCategory(Long id, SubCategoryRequest request) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        subCategory.setName(request.getName());
        subCategory.setNameTe(request.getNameTe());
        subCategory.setDescription(request.getDescription());
        subCategory.setDescriptionTe(request.getDescriptionTe());
        subCategory.setSyllabusCode(request.getSyllabusCode());
        subCategory.setCategory(category);
        if (request.getIsPublished() != null) {
            subCategory.setPublished(request.getIsPublished());
        }
        if (request.getDisplayOrder() != null) {
            subCategory.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getAccessType() != null) {
            subCategory.setAccessType(request.getAccessType());
        }
        if (request.getPriceInr() != null) {
            subCategory.setPriceInr(request.getPriceInr());
        }

        return mapToResponse(subCategoryRepository.save(subCategory));
    }

    @Transactional
    public void deleteSubCategory(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        subCategory.setDeleted(true);
        subCategoryRepository.save(subCategory);
    }

    private SubCategoryResponse mapToResponse(SubCategory subCategory) {
        return SubCategoryResponse.builder()
                .id(subCategory.getId())
                .name(subCategory.getName())
                .nameTe(subCategory.getNameTe())
                .description(subCategory.getDescription())
                .descriptionTe(subCategory.getDescriptionTe())
                .syllabusCode(subCategory.getSyllabusCode())
                .categoryId(subCategory.getCategory().getId())
                .categoryName(subCategory.getCategory().getName())
                .accessType(subCategory.getAccessType())
                .priceInr(subCategory.getPriceInr())
                .isPublished(subCategory.isPublished())
                .displayOrder(subCategory.getDisplayOrder())
                .build();
    }

    @Transactional
    public SubCategoryResponse togglePublish(Long id) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        subCategory.setPublished(!subCategory.isPublished());
        return mapToResponse(subCategoryRepository.save(subCategory));
    }

    @Transactional
    public void reorder(List<java.util.Map<String, Object>> items) {
        for (java.util.Map<String, Object> item : items) {
            Long id = Long.valueOf(item.get("id").toString());
            Integer displayOrder = Integer.valueOf(item.get("displayOrder").toString());
            subCategoryRepository.findById(id).ifPresent(entity -> {
                entity.setDisplayOrder(displayOrder);
                subCategoryRepository.save(entity);
            });
        }
    }
}
