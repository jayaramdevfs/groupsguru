import { api } from "./api";
import { Commission } from "./types";

export const commissionService = {
  getAll: async (): Promise<Commission[]> => {
    const response = await api.get("/api/commissions");
    return response.data;
  },
  getById: async (id: number): Promise<Commission> => {
    const response = await api.get(`/api/commissions/${id}`);
    return response.data;
  },
};
