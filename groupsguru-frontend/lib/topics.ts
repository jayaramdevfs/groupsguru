import api from "./api";
import { Topic, TopicRequest } from "./types";

export const topicApi = {
  // Public — no auth needed
  getAll: async (): Promise<Topic[]> => {
    const response = await api.get<Topic[]>("/api/topics");
    return response.data;
  },

  getBySection: async (sectionId: number): Promise<Topic[]> => {
    const response = await api.get<Topic[]>(`/api/topics/section/${sectionId}`);
    return response.data;
  },

  // Admin — auth required
  adminGetAll: async (): Promise<Topic[]> => {
    const response = await api.get<Topic[]>("/api/admin/topics");
    return response.data;
  },

  create: async (data: TopicRequest): Promise<Topic> => {
    const response = await api.post<Topic>("/api/admin/topics", data);
    return response.data;
  },

  update: async (id: number, data: TopicRequest): Promise<Topic> => {
    const response = await api.patch<Topic>(`/api/admin/topics/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/topics/${id}`);
  },

  togglePublish: async (id: number): Promise<Topic> => {
    const response = await api.patch<Topic>(`/api/admin/topics/${id}/toggle-publish`);
    return response.data;
  },

  reorder: async (items: { id: number; displayOrder: number }[]): Promise<void> => {
    await api.put(`/api/admin/topics/reorder`, items);
  },
};
