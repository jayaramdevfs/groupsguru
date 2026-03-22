package com.groupsguru.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc();
    List<Category> findByCommissionIdAndIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc(Long commissionId);
    List<Category> findByCommissionIdAndIsDeletedFalseOrderByDisplayOrderAsc(Long commissionId);
    List<Category> findByIsDeletedFalseOrderByDisplayOrderAsc();
}
