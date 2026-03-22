package com.groupsguru.section;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findBySubCategoryIdAndIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc(Long subCategoryId);
    List<Section> findBySubCategoryIdAndIsDeletedFalseOrderByDisplayOrderAsc(Long subCategoryId);
    List<Section> findByIsDeletedFalseOrderByDisplayOrderAsc();
    List<Section> findByIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc();
}
