package com.lms.commission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
    List<Commission> findByIsDeletedFalseOrderByDisplayOrderAsc();
    boolean existsByCode(String code);
}
