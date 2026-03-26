package com.groupsguru.question;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class JsonQuestionParser {

    private final ObjectMapper objectMapper;

    public JsonQuestionParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<Question> parse(InputStream inputStream) throws Exception {
        List<Question> questions = objectMapper.readValue(inputStream, new TypeReference<List<Question>>(){});
        for (Question q : questions) {
            if (q.getSprintId() == null || q.getSprintId().isEmpty()) {
                q.setSprintId("BULK");
            }
        }
        return questions;
    }
}
