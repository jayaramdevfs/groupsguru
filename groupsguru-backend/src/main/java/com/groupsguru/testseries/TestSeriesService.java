package com.groupsguru.testseries;

import com.groupsguru.exam.Exam;
import com.groupsguru.exam.ExamRepository;
import com.groupsguru.exam.ExamService;
import com.groupsguru.exam.ExamType;
import com.groupsguru.exam.dto.AssignQuestionsRequest;
import com.groupsguru.question.Question;
import com.groupsguru.question.QuestionRepository;
import com.groupsguru.subcategory.SubCategory;
import com.groupsguru.subcategory.SubCategoryRepository;
import com.groupsguru.testseries.dto.TestSeriesRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestSeriesService {

    @Autowired
    private TestSeriesRepository testSeriesRepository;

    @Autowired
    private TestSeriesExamRepository testSeriesExamRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamService examService;

    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private SubCategoryRepository subCategoryRepository;

    public List<TestSeries> getAllForAdmin() {
        return testSeriesRepository.findByIsDeletedFalse();
    }

    public List<TestSeries> getAllForStudent() {
        return testSeriesRepository.findByIsPublishedTrueAndIsActiveTrueAndIsDeletedFalse();
    }

    public TestSeries getById(Long id) {
        return testSeriesRepository.findById(id)
                .filter(ts -> !ts.getIsDeleted())
                .orElseThrow(() -> new RuntimeException("TestSeries not found"));
    }

    @Transactional
    public TestSeries create(TestSeriesRequest req) {
        TestSeries ts = new TestSeries();
        mapReq(req, ts);
        return testSeriesRepository.save(ts);
    }

    @Transactional
    public TestSeries update(Long id, TestSeriesRequest req) {
        TestSeries ts = getById(id);
        mapReq(req, ts);
        return testSeriesRepository.save(ts);
    }

    private void mapReq(TestSeriesRequest req, TestSeries ts) {
        if (req.getName() != null) ts.setName(req.getName());
        if (req.getNameTe() != null) ts.setNameTe(req.getNameTe());
        if (req.getDescription() != null) ts.setDescription(req.getDescription());
        if (req.getDescriptionTe() != null) ts.setDescriptionTe(req.getDescriptionTe());
        if (req.getSeriesType() != null) ts.setSeriesType(req.getSeriesType());

        ts.setCategoryId(req.getCategoryId());
        ts.setSubCategoryId(req.getSubCategoryId());
        ts.setSectionId(req.getSectionId());
        ts.setTopicId(req.getTopicId());

        if (req.getAccessType() != null) ts.setAccessType(req.getAccessType());
        ts.setPriceInr(req.getPriceInr());

        if (req.getIsActive() != null) ts.setIsActive(req.getIsActive());
        if (req.getIsPublished() != null) ts.setIsPublished(req.getIsPublished());
        if (req.getDisplayOrder() != null) ts.setDisplayOrder(req.getDisplayOrder());
    }

    @Transactional
    public void delete(Long id) {
        TestSeries ts = getById(id);
        ts.setIsDeleted(true);
        testSeriesRepository.save(ts);
    }

    @Transactional
    public void assignExams(Long seriesId, List<Long> examIds) {
        TestSeries ts = getById(seriesId);
        testSeriesExamRepository.deleteByTestSeriesId(seriesId);

        List<TestSeriesExam> assignments = new ArrayList<>();
        int seq = 1;
        for (Long examId : examIds) {
            TestSeriesExam tse = new TestSeriesExam();
            tse.setTestSeriesId(seriesId);
            tse.setExamId(examId);
            tse.setSequenceNumber(seq++);
            tse.setCreatedAt(LocalDateTime.now());
            assignments.add(tse);
        }
        testSeriesExamRepository.saveAll(assignments);

        ts.setTotalExams(assignments.size());
        testSeriesRepository.save(ts);
    }

    public List<Exam> getSeriesExams(Long seriesId) {
        List<TestSeriesExam> tses = testSeriesExamRepository.findByTestSeriesIdOrderBySequenceNumber(seriesId);
        List<Long> examIds = tses.stream().map(TestSeriesExam::getExamId).collect(Collectors.toList());
        if (examIds.isEmpty()) return Collections.emptyList();
        
        // Manual ordering to match sequence
        List<Exam> exams = examRepository.findAllById(examIds);
        return examIds.stream()
            .map(id -> exams.stream().filter(e -> e.getId().equals(id)).findFirst().orElse(null))
            .filter(e -> e != null && !e.getIsDeleted())
            .collect(Collectors.toList());
    }

    @Transactional
    public void autoGenerate(Long seriesId, int questionsPerExam, int numExams) {
        TestSeries ts = getById(seriesId);

        // Figure out filtering
        List<Question> allQuestions;
        if (ts.getSubCategoryId() != null) {
            SubCategory sc = subCategoryRepository.findById(ts.getSubCategoryId()).orElse(null);
            if (sc != null && sc.getName() != null) {
                allQuestions = questionRepository.findBySubjectAndIsDeletedFalse(sc.getName());
            } else {
                allQuestions = questionRepository.findAll();
            }
        } else {
            allQuestions = questionRepository.findAll();
        }

        allQuestions = allQuestions.stream().filter(q -> !q.getIsDeleted()).collect(Collectors.toList());

        if (allQuestions.size() < questionsPerExam) {
            throw new RuntimeException("Not enough questions available to generate exam (" + allQuestions.size() + " available)");
        }

        List<Long> generatedExamIds = new ArrayList<>();
        for (int i = 1; i <= numExams; i++) {
            Collections.shuffle(allQuestions);
            List<Long> selectedQIds = allQuestions.stream()
                .limit(questionsPerExam)
                .map(Question::getId)
                .collect(Collectors.toList());

            Exam exam = new Exam();
            exam.setName(ts.getName() + " - Exam " + i);
            exam.setNameTe(ts.getNameTe() + " - Exam " + i);
            exam.setDescription("Auto-generated exam for " + ts.getName());
            exam.setDescriptionTe("Auto-generated exam for " + ts.getNameTe());
            
            // Map type if possible
            if (ts.getSeriesType() == SeriesType.MOCK) {
                exam.setExamType(ExamType.FULL_LENGTH_TEST);
            } else {
                exam.setExamType(ExamType.SUBJECT_WISE);
            }
            
            exam.setCategoryId(ts.getCategoryId());
            exam.setSubCategoryId(ts.getSubCategoryId());
            exam.setSectionId(ts.getSectionId());
            exam.setTopicId(ts.getTopicId());
            
            exam.setTotalQuestions(questionsPerExam);
            exam.setDurationMinutes(questionsPerExam * 2); // default heuristic
            exam = examRepository.save(exam);

            AssignQuestionsRequest aqr = new AssignQuestionsRequest();
            aqr.setQuestionIds(selectedQIds);
            examService.assignQuestions(exam.getId(), aqr);
            
            generatedExamIds.add(exam.getId());
        }

        // Fetch existing assignments to append
        List<TestSeriesExam> existingExams = testSeriesExamRepository.findByTestSeriesIdOrderBySequenceNumber(seriesId);
        List<Long> allExamIds = existingExams.stream().map(TestSeriesExam::getExamId).collect(Collectors.toList());
        allExamIds.addAll(generatedExamIds);

        assignExams(seriesId, allExamIds);
    }
}
