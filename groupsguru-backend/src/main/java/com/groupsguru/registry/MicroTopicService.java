package com.groupsguru.registry;

import com.groupsguru.registry.dto.CreateMicroTopicRequest;
import com.groupsguru.registry.dto.UpdateMicroTopicRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MicroTopicService {

    @Autowired
    private MicroTopicRepository repository;

    public Page<MicroTopic> getAll(Pageable pageable, String subject, String paper, String groupApplicability) {
        if (subject != null && paper != null && groupApplicability != null) {
            return repository.findBySubjectAndPaperAndGroupApplicabilityAndIsDeletedFalse(subject, paper, groupApplicability, pageable);
        } else if (subject != null && paper != null) {
            return repository.findBySubjectAndPaperAndIsDeletedFalse(subject, paper, pageable);
        } else if (subject != null) {
            return repository.findBySubjectAndIsDeletedFalse(subject, pageable);
        }
        return repository.findByIsDeletedFalse(pageable);
    }

    public MicroTopic getByMicroTopicId(String microTopicId) {
        return repository.findByMicroTopicIdAndIsDeletedFalse(microTopicId)
                .orElseThrow(() -> new RuntimeException("MicroTopic not found with id: " + microTopicId));
    }

    public java.util.List<MicroTopic> getByTopicId(Long topicId) {
        return repository.findByTopicIdAndIsDeletedFalse(topicId);
    }

    public MicroTopic create(CreateMicroTopicRequest request) {
        // Prevent duplicates
        Optional<MicroTopic> existing = repository.findByMicroTopicIdAndIsDeletedFalse(request.getMicroTopicId());
        if (existing.isPresent()) {
            throw new RuntimeException("MicroTopic with ID " + request.getMicroTopicId() + " already exists.");
        }

        MicroTopic mt = new MicroTopic();
        mt.setMicroTopicId(request.getMicroTopicId());
        mt.setSubject(request.getSubject());
        mt.setSectionName(request.getSectionName());
        mt.setTopicName(request.getTopicName());
        mt.setMicroTopicText(request.getMicroTopicText());
        mt.setSyllabusRef(request.getSyllabusRef());
        mt.setGroupApplicability(request.getGroupApplicability());
        mt.setDepthLevel(request.getDepthLevel());
        mt.setContentType(request.getContentType());
        mt.setTopicCategory(request.getTopicCategory());
        mt.setPyqFrequency(request.getPyqFrequency());
        mt.setDifficultyTrend(request.getDifficultyTrend());
        mt.setPredictionPriority(request.getPredictionPriority());
        mt.setDataConfidence(request.getDataConfidence());
        mt.setPrelimsOrMains(request.getPrelimsOrMains());
        mt.setPaper(request.getPaper());
        mt.setTopicId(request.getTopicId());
        
        return repository.save(mt);
    }

    public MicroTopic update(String microTopicId, UpdateMicroTopicRequest request) {
        MicroTopic mt = getByMicroTopicId(microTopicId);
        if (request.getSubject() != null) mt.setSubject(request.getSubject());
        if (request.getSectionName() != null) mt.setSectionName(request.getSectionName());
        if (request.getTopicName() != null) mt.setTopicName(request.getTopicName());
        if (request.getMicroTopicText() != null) mt.setMicroTopicText(request.getMicroTopicText());
        if (request.getSyllabusRef() != null) mt.setSyllabusRef(request.getSyllabusRef());
        if (request.getGroupApplicability() != null) mt.setGroupApplicability(request.getGroupApplicability());
        if (request.getDepthLevel() != null) mt.setDepthLevel(request.getDepthLevel());
        if (request.getContentType() != null) mt.setContentType(request.getContentType());
        if (request.getTopicCategory() != null) mt.setTopicCategory(request.getTopicCategory());
        if (request.getPyqFrequency() != null) mt.setPyqFrequency(request.getPyqFrequency());
        if (request.getDifficultyTrend() != null) mt.setDifficultyTrend(request.getDifficultyTrend());
        if (request.getPredictionPriority() != null) mt.setPredictionPriority(request.getPredictionPriority());
        if (request.getDataConfidence() != null) mt.setDataConfidence(request.getDataConfidence());
        if (request.getPrelimsOrMains() != null) mt.setPrelimsOrMains(request.getPrelimsOrMains());
        if (request.getPaper() != null) mt.setPaper(request.getPaper());
        if (request.getTopicId() != null) mt.setTopicId(request.getTopicId());

        return repository.save(mt);
    }

    public void delete(String microTopicId) {
        MicroTopic mt = getByMicroTopicId(microTopicId);
        mt.setIsDeleted(true);
        repository.save(mt);
    }
}
