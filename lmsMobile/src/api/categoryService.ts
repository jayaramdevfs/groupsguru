import { api } from "./api";
import { Category } from "./types";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get("/api/categories");
      return response.data;
    } catch (error) {
      console.error("Fetch categories failed:", error);
      throw error;
    }
  },
  
  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },
};
