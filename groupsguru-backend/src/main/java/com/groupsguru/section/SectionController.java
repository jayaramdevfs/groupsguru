package com.groupsguru.section;

import com.groupsguru.section.dto.SectionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    // GET /api/sections — all sections (public)
    @GetMapping
    public List<SectionResponse> getAllSections() {
        return sectionService.getAllSections(false);
    }

    // GET /api/sections/subcategory/{id} — sections by subject (public)
    @GetMapping("/subcategory/{subCategoryId}")
    public List<SectionResponse> getSectionsBySubCategory(@PathVariable Long subCategoryId) {
        return sectionService.getSectionsBySubCategory(subCategoryId, false);
    }
}
