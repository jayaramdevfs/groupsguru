import api from "./api";
import { Category, CategoryRequest } from "./types";

export const categoryApi = {
  // Public
  getAll: async (commissionId?: number): Promise<Category[]> => {
    const url = commissionId ? `/api/categories?commissionId=${commissionId}` : "/api/categories";
    const response = await api.get(url);
    return response.data;
  },
  
  getById: async (id: number): Promise<Category> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Admin
  adminGetAll: async (commissionId?: number): Promise<Category[]> => {
    const url = commissionId ? `/api/admin/categories?commissionId=${commissionId}` : "/api/admin/categories";
    const response = await api.get(url);
    return response.data;
  },

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

  togglePublish: async (id: number): Promise<Category> => {
    const response = await api.patch(`/api/admin/categories/${id}/toggle-publish`);
    return response.data;
  },

  reorder: async (items: { id: number; displayOrder: number }[]): Promise<void> => {
    await api.put(`/api/admin/categories/reorder`, items);
  },
};
