package com.groupsguru.question;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class BulkUploadService {

    private final QuestionBatchRepository batchRepository;
    private final QuestionRepository questionRepository;
    private final MoodleXmlParser xmlParser;
    private final CsvQuestionParser csvParser;
    private final JsonQuestionParser jsonParser;

    public BulkUploadService(QuestionBatchRepository batchRepository,
                             QuestionRepository questionRepository,
                             MoodleXmlParser xmlParser,
                             CsvQuestionParser csvParser,
                             JsonQuestionParser jsonParser) {
        this.batchRepository = batchRepository;
        this.questionRepository = questionRepository;
        this.xmlParser = xmlParser;
        this.csvParser = csvParser;
        this.jsonParser = jsonParser;
    }

    @Transactional
    public QuestionBatch uploadAndParse(MultipartFile file, Long uploadedByUserId) throws Exception {
        String fileName = file.getOriginalFilename();
        if (fileName == null) fileName = "unknown";
        String format = "UNKNOWN";
        List<Question> parsedQuestions = new ArrayList<>();

        if (fileName.toLowerCase().endsWith(".xml")) {
            format = "XML";
            parsedQuestions = xmlParser.parse(file.getInputStream());
        } else if (fileName.toLowerCase().endsWith(".csv")) {
            format = "CSV";
            parsedQuestions = csvParser.parse(file.getInputStream());
        } else if (fileName.toLowerCase().endsWith(".json")) {
            format = "JSON";
            parsedQuestions = jsonParser.parse(file.getInputStream());
        } else {
            throw new RuntimeException("Unsupported file format. Please upload .csv, .json, or .xml");
        }

        QuestionBatch batch = new QuestionBatch();
        batch.setBatchName("Batch - " + fileName);
        batch.setFileName(fileName);
        batch.setFileFormat(format);
        batch.setStatus("UPLOADED");
        batch.setUploadedBy(uploadedByUserId);
        batch.setTotalQuestions(parsedQuestions.size());
        
        batch = batchRepository.save(batch);

        int successCount = 0;
        int failCount = 0;
        StringBuilder notes = new StringBuilder();

        for (Question q : parsedQuestions) {
            String error = validateQuestion(q);
            if (error == null) {
                // duplicate check - find existing by questionCode
                Optional<Question> existingOpt = questionRepository.findByQuestionCodeAndIsDeletedFalse(q.getQuestionCode());
                if (existingOpt.isPresent()) {
                    error = "DUPLICATE: This question already exists in the database.";
                }
            }
            
            if (error == null) {
                try {
                    q.setBatchId(batch.getId());
                    if (q.getSprintId() == null || q.getSprintId().isEmpty()) {
                        q.setSprintId("BULK");
                    }
                    questionRepository.save(q);
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    notes.append("Question ").append(q.getQuestionCode()).append(": DATABASE ERR: ").append(e.getMessage()).append("\n");
                }
            } else {
                failCount++;
                notes.append("Question ").append(q.getQuestionCode()).append(": ").append(error).append("\n");
            }
        }

        batch.setSuccessCount(successCount);
        batch.setFailCount(failCount);
        
        String finalNotes = notes.toString();
        if (finalNotes.length() > 4900) {
            finalNotes = finalNotes.substring(0, 4900) + "... (truncated)";
        }
        batch.setNotes(finalNotes);

        return batchRepository.save(batch);
    }

    private String validateQuestion(Question q) {
        if (q == null) return "Empty question object";
        
        if (q.getQuestionCode() == null || q.getQuestionCode().trim().isEmpty()) {
            return "Missing field: questionCode";
        }
        if (q.getQuestionTextEn() == null || q.getQuestionTextEn().trim().isEmpty()) {
            return "Missing field: questionTextEn";
        }
        if (q.getCorrectOption() == null || q.getCorrectOption().trim().isEmpty()) {
            return "Missing field: correctOption";
        }
        
        // Normalize and validate correctOption
        String co = q.getCorrectOption().trim().toUpperCase();
        if (!co.matches("[ABCD]")) {
            return "Invalid correctOption value: [" + co + "]. Must be A, B, C, or D.";
        }
        q.setCorrectOption(co);
        
        return null;
    }

    @Transactional
    public QuestionBatch approveBatch(Long batchId, Long reviewedByUserId) {
        QuestionBatch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        batch.setStatus("APPROVED");
        batch.setReviewedBy(reviewedByUserId);
        batch.setReviewedAt(LocalDateTime.now());
        return batchRepository.save(batch);
    }

    @Transactional
    public QuestionBatch rejectBatch(Long batchId, Long reviewedByUserId) {
        QuestionBatch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        batch.setStatus("REJECTED");
        batch.setReviewedBy(reviewedByUserId);
        batch.setReviewedAt(LocalDateTime.now());

        List<Question> questions = questionRepository.findByBatchIdAndIsDeletedFalse(batchId);
        for (Question q : questions) {
            q.setIsDeleted(true);
            questionRepository.save(q);
        }

        return batchRepository.save(batch);
    }

    public List<Question> getBatchQuestions(Long batchId) {
        return questionRepository.findByBatchIdAndIsDeletedFalse(batchId);
    }
}
