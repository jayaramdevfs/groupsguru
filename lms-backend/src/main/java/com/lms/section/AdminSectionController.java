package com.lms.section;

import com.lms.section.dto.SectionRequest;
import com.lms.section.dto.SectionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sections")
@RequiredArgsConstructor
public class AdminSectionController {

    private final SectionService sectionService;

    @GetMapping
    public List<SectionResponse> getAllSections() {
        return sectionService.getAllSections();
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getSectionCount() {
        long count = sectionService.getAllSections().size();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping
    public ResponseEntity<SectionResponse> createSection(@RequestBody SectionRequest request) {
        return ResponseEntity.ok(sectionService.createSection(request));
    }

    // Support both PUT and PATCH — both update the full resource
    @PutMapping("/{id}")
    public ResponseEntity<SectionResponse> updateSectionPut(@PathVariable Long id, @RequestBody SectionRequest request) {
        return ResponseEntity.ok(sectionService.updateSection(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SectionResponse> updateSectionPatch(@PathVariable Long id, @RequestBody SectionRequest request) {
        return ResponseEntity.ok(sectionService.updateSection(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
        return ResponseEntity.noContent().build();
    }
}
