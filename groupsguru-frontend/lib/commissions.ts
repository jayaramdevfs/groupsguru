import api from "./api";
import { Commission, CommissionRequest } from "./types";

export const commissionApi = {
  // Public
  getAll: async (): Promise<Commission[]> => {
    const response = await api.get("/api/commissions");
    return response.data;
  },
  
  getById: async (id: number): Promise<Commission> => {
    const response = await api.get(`/api/commissions/${id}`);
    return response.data;
  },

  // Admin
  create: async (data: CommissionRequest): Promise<Commission> => {
    const response = await api.post("/api/admin/commissions", data);
    return response.data;
  },

  update: async (id: number, data: Partial<CommissionRequest>): Promise<Commission> => {
    const response = await api.patch(`/api/admin/commissions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/commissions/${id}`);
  },
};
