import { api } from "./api";
import { Section } from "./types";

export const sectionService = {
  getAll: async (): Promise<Section[]> => {
    try {
      const response = await api.get("/api/sections");
      return response.data;
    } catch (error) {
      console.error("Fetch sections failed:", error);
      throw error;
    }
  },

  getBySubCategoryId: async (subCategoryId: number): Promise<Section[]> => {
    try {
      const response = await api.get(`/api/sections/subcategory/${subCategoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Fetch sections for subcategory ${subCategoryId} failed:`, error);
      throw error;
    }
  },
};
