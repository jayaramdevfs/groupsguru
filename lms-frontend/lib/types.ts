export interface Commission {
  id: number;
  code: string;
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  imageUrl?: string;
  displayOrder: number;
  accessType: string;
  priceInr?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommissionRequest {
  code: string;
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  imageUrl?: string;
  displayOrder?: number;
  accessType?: string;
  priceInr?: number;
  isActive?: boolean;
}

export interface Category {
  id: number;
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  imageUrl?: string;
  commissionId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  imageUrl?: string;
  commissionId: number;
}

export interface SubCategory {
  id: number;
  name: string;
  nameTe?: string;
  description?: string;
  descriptionTe?: string;
  syllabusCode?: string;
  categoryId: number;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategoryRequest {
  name: string;
  nameTe?: string;
  description?: string;
  descriptionTe?: string;
  syllabusCode?: string;
  categoryId: number;
}

export interface Section {
  id: number;
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  sectionCode?: string;
  subCategoryId: number;
  subCategoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionRequest {
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  sectionCode?: string;
  subCategoryId: number;
}

export interface Topic {
  id: number;
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  topicCode?: string;
  sectionId: number;
  sectionName: string;
  subCategoryId: number;
  subCategoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicRequest {
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  topicCode?: string;
  sectionId: number;
}

export interface MicroTopic {
  id: number;
  microTopicId: string;
  subject: string;
  sectionName?: string;
  topicName?: string;
  microTopicText?: string;
  syllabusRef?: string;
  groupApplicability?: string;
  depthLevel?: string;
  contentType?: string;
  topicCategory?: string;
  pyqFrequency?: string;
  difficultyTrend?: string;
  predictionPriority?: string;
  dataConfidence: string;
  prelimsOrMains?: string;
  paper?: string;
  topicId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MicroTopicRequest {
  microTopicId: string;
  subject: string;
  sectionName?: string;
  topicName?: string;
  microTopicText?: string;
  syllabusRef?: string;
  groupApplicability?: string;
  depthLevel?: string;
  contentType?: string;
  topicCategory?: string;
  pyqFrequency?: string;
  difficultyTrend?: string;
  predictionPriority?: string;
  dataConfidence: string;
  prelimsOrMains?: string;
  paper?: string;
  topicId?: number;
}

export interface Question {
  id: number;
  questionCode: string;
  questionTextEn: string;
  questionTextTe: string;
  optionAEn: string;
  optionATe: string;
  optionBEn: string;
  optionBTe: string;
  optionCEn: string;
  optionCTe: string;
  optionDEn: string;
  optionDTe: string;
  correctOption: string;
  explanationEn?: string;
  explanationTe?: string;
  microTopicId: string;
  subject: string;
  difficulty: string;
  cognitiveLevel: string;
  questionType: string;
  sprintId: string;
  penalty: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionRequest {
  questionCode: string;
  questionTextEn: string;
  questionTextTe: string;
  optionAEn: string;
  optionATe: string;
  optionBEn: string;
  optionBTe: string;
  optionCEn: string;
  optionCTe: string;
  optionDEn: string;
  optionDTe: string;
  correctOption: string;
  explanationEn?: string;
  explanationTe?: string;
  microTopicId: string;
  subject: string;
  difficulty: string;
  cognitiveLevel: string;
  questionType: string;
  sprintId: string;
  penalty?: number;
}

export type ExamType = 'TOPIC_WISE' | 'SECTION_WISE' | 'SUBJECT_WISE' | 'FULL_LENGTH_TEST';

export interface Exam {
  id: number;
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  examType: ExamType;
  subject?: string;
  totalQuestions: number;
  durationMinutes: number;
  negativeMarking: boolean;
  penaltyPerWrong: number;
  marksPerQuestion: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamRequest {
  name: string;
  nameTe: string;
  description?: string;
  descriptionTe?: string;
  examType: ExamType;
  subject?: string;
  totalQuestions?: number;
  durationMinutes?: number;
  negativeMarking?: boolean;
  penaltyPerWrong?: number;
  marksPerQuestion?: number;
  isActive?: boolean;
}

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EVALUATED';

export interface ExamAttempt {
  id: number;
  examId: number;
  userId: number;
  startedAt: string;
  submittedAt?: string;
  totalMarks?: number;
  correctCount?: number;
  wrongCount?: number;
  unattemptedCount?: number;
  status: AttemptStatus;
}

export interface AttemptAnswer {
  id: number;
  attemptId: number;
  questionId: number;
  selectedOption?: string;
  isCorrect?: boolean;
  marks?: number;
}

export interface AttemptStartResponse {
  attemptId: number;
  examId: number;
  examName: string;
  examNameTe: string;
  durationMinutes: number;
  questions: Question[];
}

export interface SubmitAttemptRequest {
  answers: {
    questionId: number;
    selectedOption: string | null;
  }[];
}
export interface TopicAnalytics {
  topicName: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  hitRate: number;
}

export interface QuestionResult {
  question: Question;
  selectedOption?: string;
  isCorrect?: boolean;
  marks: number;
}

export interface ExamResult {
  attempt: ExamAttempt;
  questions: QuestionResult[];
  topicAnalytics: TopicAnalytics[];
}
