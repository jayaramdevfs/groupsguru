package com.lms.section;

import com.lms.section.dto.SectionRequest;
import com.lms.section.dto.SectionResponse;
import com.lms.subcategory.SubCategory;
import com.lms.subcategory.SubCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionService {

    private final SectionRepository sectionRepository;
    private final SubCategoryRepository subCategoryRepository;

    @Transactional(readOnly = true)
    public List<SectionResponse> getAllSections() {
        return sectionRepository.findByIsDeletedFalse().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SectionResponse> getSectionsBySubCategory(Long subCategoryId) {
        return sectionRepository.findBySubCategoryIdAndIsDeletedFalse(subCategoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SectionResponse createSection(SectionRequest request) {
        SubCategory subCategory = subCategoryRepository.findById(request.getSubCategoryId())
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        Section section = Section.builder()
                .name(request.getName())
                .nameTe(request.getNameTe())
                .description(request.getDescription())
                .descriptionTe(request.getDescriptionTe())
                .sectionCode(request.getSectionCode())
                .subCategory(subCategory)
                .build();

        Section savedSection = sectionRepository.save(section);
        return mapToResponse(savedSection);
    }

    @Transactional
    public SectionResponse updateSection(Long id, SectionRequest request) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        section.setName(request.getName());
        section.setNameTe(request.getNameTe());
        section.setDescription(request.getDescription());
        section.setDescriptionTe(request.getDescriptionTe());
        section.setSectionCode(request.getSectionCode());

        // Update subcategory if changed
        if (!section.getSubCategory().getId().equals(request.getSubCategoryId())) {
            SubCategory subCategory = subCategoryRepository.findById(request.getSubCategoryId())
                    .orElseThrow(() -> new RuntimeException("SubCategory not found"));
            section.setSubCategory(subCategory);
        }

        Section updatedSection = sectionRepository.save(section);
        return mapToResponse(updatedSection);
    }

    @Transactional
    public void deleteSection(Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        section.setDeleted(true);
        sectionRepository.save(section);
    }

    private SectionResponse mapToResponse(Section section) {
        return SectionResponse.builder()
                .id(section.getId())
                .name(section.getName())
                .nameTe(section.getNameTe())
                .description(section.getDescription())
                .descriptionTe(section.getDescriptionTe())
                .sectionCode(section.getSectionCode())
                .subCategoryId(section.getSubCategory().getId())
                .subCategoryName(section.getSubCategory().getName())
                .accessType(section.getAccessType())
                .priceInr(section.getPriceInr())
                .createdAt(section.getCreatedAt())
                .updatedAt(section.getUpdatedAt())
                .build();
    }
}
