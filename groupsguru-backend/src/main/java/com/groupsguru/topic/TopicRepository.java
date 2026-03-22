package com.groupsguru.topic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findBySectionIdAndIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc(Long sectionId);
    List<Topic> findBySectionIdAndIsDeletedFalseOrderByDisplayOrderAsc(Long sectionId);
    List<Topic> findByIsDeletedFalseOrderByDisplayOrderAsc();
    List<Topic> findByIsDeletedFalseAndIsPublishedTrueOrderByDisplayOrderAsc();
}
