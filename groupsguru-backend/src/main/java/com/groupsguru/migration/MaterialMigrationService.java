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

    @Transactional
    public String syncMaterialsFromDisk() {
        File baseDir = new File(CONTENT_BASE_PATH);
        if (!baseDir.exists() || !baseDir.isDirectory()) {
            return "Error: Content directory " + CONTENT_BASE_PATH + " not found.";
        }

        int count = 0;
        File[] sprintDirs = baseDir.listFiles(File::isDirectory);
        if (sprintDirs == null) return "No sprint directories found.";

        for (File sprintDir : sprintDirs) {
            String sprintName = sprintDir.getName(); // e.g., CG-06-science-tech
            File notesFile = new File(sprintDir, "notes-english.md");
            
            if (notesFile.exists()) {
                // Check if already synced
                String title = sprintName.replace("-", " ").toUpperCase() + " - Study Notes";
                if (materialRepository.findByTitleAndIsDeletedFalse(title).isEmpty()) {
                    StudyMaterial material = new StudyMaterial();
                    material.setTitle(title);
                    material.setEntityType("TOPIC"); // Defaulting to Topic for now
                    material.setEntityId(1L); // Placeholder, will refine mapping
                    material.setFileType("MD");
                    material.setFileName("notes-english.md");
                    material.setAccessType("FREE");
                    material.setPublished(true);
                    material.setSubject(extractSubjectFromSprint(sprintName));
                    
                    // We'll store the content in a simple way or reference the path
                    // For this live sync, we'll actually save the material record
                    materialRepository.save(material);
                    count++;
                }
            }
        }

        return "Successfully synced " + count + " new study materials from disk.";
    }

    private String extractSubjectFromSprint(String sprintName) {
        if (sprintName.contains("history")) return "History";
        if (sprintName.contains("science")) return "Science & Tech";
        if (sprintName.contains("ap-specific")) return "AP Specific";
        if (sprintName.contains("economy")) return "Economy";
        if (sprintName.contains("polity")) return "Polity";
        if (sprintName.contains("geography")) return "Geography";
        return "General";
    }
}
