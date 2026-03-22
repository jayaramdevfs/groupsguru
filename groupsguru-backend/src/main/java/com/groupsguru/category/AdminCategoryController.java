package com.groupsguru.category;

import com.groupsguru.category.dto.CategoryRequest;
import com.groupsguru.category.dto.CategoryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getAllCategories(@RequestParam(required = false) Long commissionId) {
        return categoryService.getAllCategories(commissionId, true);
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteCategory(@PathVariable Long id) {
        categoryService.softDeleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-publish")
    public ResponseEntity<CategoryResponse> togglePublish(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.togglePublish(id));
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody List<java.util.Map<String, Object>> items) {
        categoryService.reorder(items);
        return ResponseEntity.ok().build();
    }
}
