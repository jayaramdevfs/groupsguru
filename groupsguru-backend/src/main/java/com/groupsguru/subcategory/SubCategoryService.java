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
    public List<SubCategoryResponse> getAllSubCategories() {
        return subCategoryRepository.findByIsDeletedFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubCategoryResponse> getSubCategoriesByCategory(Long categoryId) {
        return subCategoryRepository.findByCategoryIdAndIsDeletedFalse(categoryId).stream()
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
                .build();
    }
}
