import api from "./api";
import { SubCategory, SubCategoryRequest } from "./types";

export const subCategoryApi = {
  // Public
  getAll: async (): Promise<SubCategory[]> => {
    const response = await api.get("/api/subcategories");
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<SubCategory[]> => {
    const response = await api.get(`/api/subcategories/category/${categoryId}`);
    return response.data;
  },

  // Admin
  adminGetAll: async (): Promise<SubCategory[]> => {
    const response = await api.get("/api/admin/subcategories");
    return response.data;
  },

  create: async (data: SubCategoryRequest): Promise<SubCategory> => {
    const response = await api.post("/api/admin/subcategories", data);
    return response.data;
  },

  update: async (id: number, data: SubCategoryRequest): Promise<SubCategory> => {
    const response = await api.put(`/api/admin/subcategories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/subcategories/${id}`);
  },

  togglePublish: async (id: number): Promise<SubCategory> => {
    const response = await api.patch(`/api/admin/subcategories/${id}/toggle-publish`);
    return response.data;
  },

  reorder: async (items: { id: number; displayOrder: number }[]): Promise<void> => {
    await api.put(`/api/admin/subcategories/reorder`, items);
  },
};
