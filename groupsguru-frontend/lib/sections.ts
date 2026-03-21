import api from "./api";
import { Section, SectionRequest } from "./types";

export const sectionApi = {
  // Public — no auth needed
  getAll: async (): Promise<Section[]> => {
    const response = await api.get<Section[]>("/api/sections");
    return response.data;
  },

  getBySubCategory: async (subCategoryId: number): Promise<Section[]> => {
    const response = await api.get<Section[]>(`/api/sections/subcategory/${subCategoryId}`);
    return response.data;
  },

  // Admin — auth required
  adminGetAll: async (): Promise<Section[]> => {
    const response = await api.get<Section[]>("/api/admin/sections");
    return response.data;
  },

  create: async (data: SectionRequest): Promise<Section> => {
    const response = await api.post<Section>("/api/admin/sections", data);
    return response.data;
  },

  update: async (id: number, data: SectionRequest): Promise<Section> => {
    const response = await api.patch<Section>(`/api/admin/sections/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/sections/${id}`);
  },
};
