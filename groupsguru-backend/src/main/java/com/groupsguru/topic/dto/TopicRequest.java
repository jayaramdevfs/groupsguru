package com.groupsguru.topic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicRequest {
    private String name;
    private String nameTe;
    private String description;
    private String descriptionTe;
    private String topicCode;
    private Long sectionId;
}
