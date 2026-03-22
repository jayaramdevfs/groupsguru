package com.groupsguru.subcategory;

import com.groupsguru.subcategory.dto.SubCategoryRequest;
import com.groupsguru.subcategory.dto.SubCategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subcategories")
@RequiredArgsConstructor
public class AdminSubCategoryController {

    private final SubCategoryService subCategoryService;

    @GetMapping
    public List<SubCategoryResponse> getAllSubCategories() {
        return subCategoryService.getAllSubCategories(true);
    }

    @PostMapping
    public SubCategoryResponse createSubCategory(@RequestBody SubCategoryRequest request) {
        return subCategoryService.createSubCategory(request);
    }

    @PutMapping("/{id}")
    public SubCategoryResponse updateSubCategory(@PathVariable Long id, @RequestBody SubCategoryRequest request) {
        return subCategoryService.updateSubCategory(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubCategory(@PathVariable Long id) {
        subCategoryService.deleteSubCategory(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-publish")
    public ResponseEntity<SubCategoryResponse> togglePublish(@PathVariable Long id) {
        return ResponseEntity.ok(subCategoryService.togglePublish(id));
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody List<java.util.Map<String, Object>> items) {
        subCategoryService.reorder(items);
        return ResponseEntity.ok().build();
    }
}
