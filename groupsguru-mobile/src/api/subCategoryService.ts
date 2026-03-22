import { api } from "./api";
import { SubCategory } from "./types";

export const subCategoryService = {
  getAll: async (): Promise<SubCategory[]> => {
    try {
      const response = await api.get("/api/subcategories");
      return response.data;
    } catch (error) {
      console.error("Fetch subcategories failed:", error);
      throw error;
    }
  },

  getByCategoryId: async (categoryId: number): Promise<SubCategory[]> => {
    try {
      const response = await api.get(`/api/subcategories/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Fetch subcategories for category ${categoryId} failed:`, error);
      throw error;
    }
  },
};
