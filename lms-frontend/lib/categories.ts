import api from "./api";
import { Category, CategoryRequest } from "./types";

export const categoryApi = {
  // Public
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/api/categories");
    return response.data;
  },
  
  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Admin
  create: async (data: CategoryRequest): Promise<Category> => {
    const response = await api.post("/api/admin/categories", data);
    return response.data;
  },

  update: async (id: number, data: Partial<CategoryRequest>): Promise<Category> => {
    const response = await api.patch(`/api/admin/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/categories/${id}`);
  },
};
