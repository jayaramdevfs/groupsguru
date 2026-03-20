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
