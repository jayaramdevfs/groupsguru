package com.groupsguru.registry;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MicroTopicRepository extends JpaRepository<MicroTopic, Long> {
    Optional<MicroTopic> findByMicroTopicIdAndIsDeletedFalse(String microTopicId);
    
    List<MicroTopic> findByTopicIdAndIsDeletedFalse(Long topicId);
    
    long countByIsDeletedFalse();

    List<MicroTopic> findAllByMicroTopicIdIn(Collection<String> microTopicIds);

    Page<MicroTopic> findByIsDeletedFalse(Pageable pageable);

    Page<MicroTopic> findBySubjectAndIsDeletedFalse(String subject, Pageable pageable);

    Page<MicroTopic> findBySubjectAndPaperAndIsDeletedFalse(String subject, String paper, Pageable pageable);

    Page<MicroTopic> findBySubjectAndPaperAndGroupApplicabilityAndIsDeletedFalse(String subject, String paper, String groupApplicability, Pageable pageable);
}
