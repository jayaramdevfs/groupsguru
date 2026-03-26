package com.groupsguru.content;

import com.groupsguru.access.AccessCheckResponse;
import com.groupsguru.access.AccessService;
import com.groupsguru.auth.User;
import com.groupsguru.auth.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/content")
@RequiredArgsConstructor
public class StudentStudyMaterialController {

    private final StudyMaterialService studyMaterialService;
    private final AccessService accessService;
    private final UserRepository userRepository;

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<StudyMaterial>> getPublishedByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        return ResponseEntity.ok(studyMaterialService.getPublishedByEntity(entityType, entityId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(
            @PathVariable Long id,
            Authentication authentication) {
        StudyMaterial material = studyMaterialService.getById(id);
        if (!material.isPublished()) {
            return ResponseEntity.notFound().build();
        }

        User user = resolveUser(authentication);
        AccessCheckResponse access = accessService.checkAccess(user.getId(), material.getEntityType(), material.getEntityId());
        if (!access.isHasAccess()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Resource resource = studyMaterialService.getFile(id);

        MediaType contentType = MediaType.APPLICATION_OCTET_STREAM;
        if (material.getMimeType() != null && !material.getMimeType().isBlank()) {
            try {
                contentType = MediaType.parseMediaType(material.getMimeType());
            } catch (Exception ignored) {
                contentType = MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        String downloadName = material.getFileName() != null ? material.getFileName() : resource.getFilename();
        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadName + "\"")
                .body(resource);
    }

    private User resolveUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }
}
