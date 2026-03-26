package com.groupsguru.content;

import com.groupsguru.content.dto.StudyMaterialRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/content")
@RequiredArgsConstructor
public class AdminStudyMaterialController {

    private final StudyMaterialService service;

    @GetMapping
    public ResponseEntity<Page<StudyMaterial>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyMaterial> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<StudyMaterial>> getByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        return ResponseEntity.ok(service.getByEntity(entityType, entityId));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCount() {
        return ResponseEntity.ok(service.getCount());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudyMaterial> create(
            @RequestPart("metadata") StudyMaterialRequest request,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(service.create(request, file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyMaterial> update(
            @PathVariable Long id,
            @RequestBody StudyMaterialRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
