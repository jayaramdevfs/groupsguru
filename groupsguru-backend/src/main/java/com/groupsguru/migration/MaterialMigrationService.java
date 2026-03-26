package com.groupsguru.migration;

import com.groupsguru.content.StudyMaterial;
import com.groupsguru.content.StudyMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MaterialMigrationService {

    private final StudyMaterialRepository materialRepository;
    private final String CONTENT_BASE_PATH = "C:\\GroupsGuru\\content";

    @org.springframework.beans.factory.annotation.Value("${app.storage.location}")
    private String storageLocation;

    @Transactional
    public String syncMaterialsFromDisk() {
        java.io.File baseDir = new java.io.File(CONTENT_BASE_PATH);
        if (!baseDir.exists() || !baseDir.isDirectory()) {
            return "Error: Content directory " + CONTENT_BASE_PATH + " not found.";
        }

        Path uploadsPath = Paths.get(storageLocation).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadsPath);
        } catch (java.io.IOException e) {
            return "Error: Could not create uploads directory.";
        }

        int newCount = 0;
        int fixedCount = 0;
        java.io.File[] sprintDirs = baseDir.listFiles(java.io.File::isDirectory);
        if (sprintDirs == null) return "No sprint directories found.";

        // Pre-fetch all materials for faster fuzzy matching
        List<StudyMaterial> allMaterials = materialRepository.findAll();

        for (java.io.File sprintDir : sprintDirs) {
            String sprintName = sprintDir.getName(); 
            java.io.File notesFile = new java.io.File(sprintDir, "notes-english.md");
            
            if (notesFile.exists()) {
                String title = sprintName.replace("-", " ").toUpperCase() + " - Study Notes";
                
                // Fuzzy match existing materials to avoid duplicates
                Optional<StudyMaterial> existing = allMaterials.stream()
                        .filter(m -> !m.isDeleted() && normalizeTitle(m.getTitle()).equals(normalizeTitle(title)))
                        .findFirst();
                
                StudyMaterial material;
                if (existing.isPresent()) {
                    material = existing.get();
                    // If it already has a file that exists, skip
                    if (material.getStoredFileName() != null && Files.exists(uploadsPath.resolve(material.getStoredFileName()))) {
                        continue; 
                    }
                } else {
                    material = new StudyMaterial();
                    material.setTitle(title);
                    material.setEntityType("TOPIC");
                    material.setEntityId(1L);
                    material.setFileType("MD");
                    material.setFileName("notes-english.md");
                    material.setAccessType("FREE");
                    material.setPublished(true);
                    material.setSubject(extractSubjectFromSprint(sprintName));
                }

                // Copy file and set storedFileName
                try {
                    String uuidName = java.util.UUID.randomUUID().toString() + ".md";
                    Files.copy(notesFile.toPath(), uploadsPath.resolve(uuidName), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    material.setStoredFileName(uuidName);
                    material.setMimeType("text/markdown");
                    material.setFileSize(notesFile.length());
                    materialRepository.save(material);
                    
                    if (existing.isPresent()) fixedCount++;
                    else newCount++;
                } catch (java.io.IOException e) {
                    System.err.println("Failed to copy file for " + title + ": " + e.getMessage());
                }
            }
        }

        return String.format("Sync complete. New: %d, Fixed existing: %d", newCount, fixedCount);
    }

    private String normalizeTitle(String title) {
        if (title == null) return "";
        return title.toLowerCase()
                .replace("—", "-") // Normalize long dash to regular dash
                .replace(" ", "-") // Normalize space to dash
                .replaceAll("-+", "-") // Remove redundant dashes
                .trim();
    }

    private String extractSubjectFromSprint(String sprintName) {
        String lower = sprintName.toLowerCase();
        if (lower.contains("history")) return "History";
        if (lower.contains("science") || lower.contains("tech")) return "Science & Tech";
        if (lower.contains("ap-specific") || lower.contains("ap-")) return "AP Specific";
        if (lower.contains("economy")) return "Economy";
        if (lower.contains("polity")) return "Polity";
        if (lower.contains("geography")) return "Geography";
        if (lower.contains("environment")) return "Environment";
        return "General";
    }
}
