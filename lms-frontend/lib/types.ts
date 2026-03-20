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
