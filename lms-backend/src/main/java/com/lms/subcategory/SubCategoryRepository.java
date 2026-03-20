package com.lms.subcategory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    List<SubCategory> findByCategoryIdAndIsDeletedFalse(Long categoryId);
    List<SubCategory> findByIsDeletedFalse();
}
