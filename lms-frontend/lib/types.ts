export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
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
