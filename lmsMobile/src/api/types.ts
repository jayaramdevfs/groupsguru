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
