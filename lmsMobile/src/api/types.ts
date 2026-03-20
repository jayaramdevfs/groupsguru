export interface Category {
  id: number;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  imageUrl?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  syllabusCode: string;
  categoryId: number;
}
export interface Section {
  id: number;
  name: string;
  nameTe: string;
  description: string;
  descriptionTe: string;
  sectionCode: string;
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
}

export interface MicroTopic {
  id: number;
  microTopicId: string;
  subject: string;
  topicName?: string;
  microTopicText?: string;
  groupApplicability?: string;
  paper?: string;
  dataConfidence: string;
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
}
