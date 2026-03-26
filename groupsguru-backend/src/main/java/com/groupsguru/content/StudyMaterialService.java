package com.groupsguru.content;

import com.groupsguru.common.service.FileStorageService;
import com.groupsguru.content.dto.StudyMaterialRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyMaterialService {

    private final StudyMaterialRepository repository;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<StudyMaterial> getAll(Pageable pageable) {
        return repository.findByIsDeletedFalse(pageable);
    }

    @Transactional(readOnly = true)
    public List<StudyMaterial> getEverythingIncludingUnpublishedForTest() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<StudyMaterial> getByEntity(String entityType, Long entityId) {
        return repository.findByEntityTypeAndEntityIdAndIsDeletedFalseOrderByDisplayOrder(normalizeEntityType(entityType), entityId);
    }

    @Transactional(readOnly = true)
    public List<StudyMaterial> getPublishedByEntity(String entityType, Long entityId) {
        return repository.findByEntityTypeAndEntityIdAndIsPublishedTrueAndIsDeletedFalseOrderByDisplayOrder(normalizeEntityType(entityType), entityId);
    }

    @Transactional(readOnly = true)
    public StudyMaterial getById(Long id) {
        return repository.findById(id)
                .filter(material -> !material.isDeleted())
                .orElseThrow(() -> new RuntimeException("Study material not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public long getCount() {
        return repository.countByIsDeletedFalse();
    }

    @Transactional
    public StudyMaterial create(StudyMaterialRequest request, MultipartFile file) {
        StudyMaterial material = StudyMaterial.builder().build();
        mapRequestToEntity(request, material);

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is required");
        }

        String storedFileName = fileStorageService.store(file);
        material.setStoredFileName(storedFileName);
        material.setFileName(file.getOriginalFilename());
        material.setMimeType(file.getContentType());
        material.setFileSize(file.getSize());

        if (material.getFileType() == null || material.getFileType().isBlank()) {
            material.setFileType(resolveFileType(file.getContentType()));
        }

        return repository.save(material);
    }

    @Transactional
    public StudyMaterial update(Long id, StudyMaterialRequest request) {
        StudyMaterial material = getById(id);
        mapRequestToEntity(request, material);
        return repository.save(material);
    }

    @Transactional
    public void delete(Long id) {
        StudyMaterial material = getById(id);
        material.setDeleted(true);
        repository.save(material);

        if (material.getStoredFileName() != null && !material.getStoredFileName().isBlank()) {
            fileStorageService.delete(material.getStoredFileName());
        }
    }

    @Transactional(readOnly = true)
    public Resource getFile(Long id) {
        StudyMaterial material = getById(id);
        if (material.getStoredFileName() == null || material.getStoredFileName().isBlank()) {
            throw new RuntimeException("No file attached for study material id: " + id);
        }
        return fileStorageService.loadAsResource(material.getStoredFileName());
    }

    private void mapRequestToEntity(StudyMaterialRequest request, StudyMaterial material) {
        if (request.getTitle() != null) material.setTitle(request.getTitle());
        if (request.getTitleTe() != null) material.setTitleTe(request.getTitleTe());
        if (request.getDescription() != null) material.setDescription(request.getDescription());
        if (request.getDescriptionTe() != null) material.setDescriptionTe(request.getDescriptionTe());
        if (request.getEntityType() != null) material.setEntityType(normalizeEntityType(request.getEntityType()));
        if (request.getEntityId() != null) material.setEntityId(request.getEntityId());
        if (request.getFileType() != null) material.setFileType(request.getFileType().trim().toUpperCase());
        if (request.getSubject() != null) material.setSubject(request.getSubject());
        if (request.getAccessType() != null) material.setAccessType(request.getAccessType().trim().toUpperCase());
        if (request.getPriceInr() != null) material.setPriceInr(request.getPriceInr());
        if (request.getIsPublished() != null) material.setPublished(request.getIsPublished());
        if (request.getDisplayOrder() != null) material.setDisplayOrder(request.getDisplayOrder());
    }

    private String normalizeEntityType(String entityType) {
        return entityType == null ? null : entityType.trim().toUpperCase();
    }

    private String resolveFileType(String mimeType) {
        if (mimeType == null || mimeType.isBlank()) {
            return "FILE";
        }
        if (mimeType.startsWith("application/pdf")) {
            return "PDF";
        }
        if (mimeType.startsWith("text/")) {
            return "TEXT";
        }
        if (mimeType.startsWith("image/")) {
            return "IMAGE";
        }
        return "FILE";
    }
}
