package com.lms.section;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findBySubCategoryIdAndIsDeletedFalse(Long subCategoryId);
    List<Section> findByIsDeletedFalse();
}
