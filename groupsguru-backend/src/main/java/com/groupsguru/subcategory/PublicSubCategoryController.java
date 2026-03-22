package com.groupsguru.subcategory;

import com.groupsguru.subcategory.dto.SubCategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
@RequiredArgsConstructor
public class PublicSubCategoryController {

    private final SubCategoryService subCategoryService;

    @GetMapping("/category/{categoryId}")
    public List<SubCategoryResponse> getSubCategoriesByCategory(@PathVariable Long categoryId) {
        return subCategoryService.getSubCategoriesByCategory(categoryId, false);
    }
}
