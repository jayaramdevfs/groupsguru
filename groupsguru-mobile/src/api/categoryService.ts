import { api } from "./api";
import { Category } from "./types";

export const categoryService = {
  getAll: async (commissionId?: number): Promise<Category[]> => {
    try {
      const url = commissionId ? `/api/categories?commissionId=${commissionId}` : "/api/categories";
      const response = await api.get(url);
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
