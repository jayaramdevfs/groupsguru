package com.groupsguru.content;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "title_te")
    private String titleTe;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_te", columnDefinition = "TEXT")
    private String descriptionTe;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "stored_file_name")
    private String storedFileName;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "access_type", length = 10)
    @Builder.Default
    private String accessType = "FREE";

    @Column(name = "price_inr")
    private Double priceInr;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    @JsonProperty("isPublished")
    private boolean isPublished = true;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    @JsonProperty("isDeleted")
    private boolean isDeleted = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
