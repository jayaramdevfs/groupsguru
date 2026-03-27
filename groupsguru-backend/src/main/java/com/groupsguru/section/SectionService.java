package com.groupsguru.section;

import com.groupsguru.section.dto.SectionRequest;
import com.groupsguru.section.dto.SectionResponse;
import com.groupsguru.subcategory.SubCategory;
import com.groupsguru.subcategory.SubCategoryRepository;
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
    public List<SectionResponse> getAllSections(boolean isAdmin) {
        List<Section> items = isAdmin
                ? sectionRepository.findByIsDeletedFalseOrderByDisplayOrderAsc()
                : sectionRepository.findByIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc();
        return items.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SectionResponse> getSectionsBySubCategory(Long subCategoryId, boolean isAdmin) {
        List<Section> items = isAdmin
                ? sectionRepository.findBySubCategoryIdAndIsDeletedFalseOrderByDisplayOrderAsc(subCategoryId)
                : sectionRepository.findBySubCategoryIdAndIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc(subCategoryId);
        return items.stream()
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
                .isPublished(request.getIsPublished() != null ? request.getIsPublished() : true)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .accessType(request.getAccessType() != null ? request.getAccessType() : "FREE")
                .priceInr(request.getPriceInr() != null ? request.getPriceInr() : 0.0)
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
        if (request.getIsPublished() != null) {
            section.setPublished(request.getIsPublished());
        }
        if (request.getDisplayOrder() != null) {
            section.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getAccessType() != null) {
            section.setAccessType(request.getAccessType());
        }
        if (request.getPriceInr() != null) {
            section.setPriceInr(request.getPriceInr());
        }

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
                .isPublished(section.isPublished())
                .displayOrder(section.getDisplayOrder())
                .createdAt(section.getCreatedAt())
                .updatedAt(section.getUpdatedAt())
                .build();
    }

    @Transactional
    public SectionResponse togglePublish(Long id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        section.setPublished(!section.isPublished());
        return mapToResponse(sectionRepository.save(section));
    }

    @Transactional
    public void reorder(List<java.util.Map<String, Object>> items) {
        for (java.util.Map<String, Object> item : items) {
            Long id = Long.valueOf(item.get("id").toString());
            Integer displayOrder = Integer.valueOf(item.get("displayOrder").toString());
            sectionRepository.findById(id).ifPresent(entity -> {
                entity.setDisplayOrder(displayOrder);
                sectionRepository.save(entity);
            });
        }
    }
}
