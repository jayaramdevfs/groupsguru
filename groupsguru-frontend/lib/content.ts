import api from "./api";
import { StudyMaterial } from "./types";

export const contentApi = {
  // Admin
  getAll: async (page = 0, size = 20): Promise<{ content: StudyMaterial[]; totalElements: number; totalPages: number }> => {
    const response = await api.get(`/api/admin/content?page=${page}&size=${size}`);
    return response.data;
  },

  getByEntity: async (entityType: string, entityId: number): Promise<StudyMaterial[]> => {
    const response = await api.get(`/api/admin/content/entity/${entityType}/${entityId}`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await api.get("/api/admin/content/count");
    return response.data;
  },

  upload: async (metadata: Partial<StudyMaterial>, file: File): Promise<StudyMaterial> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    const response = await api.post("/api/admin/content", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: number, data: Partial<StudyMaterial>): Promise<StudyMaterial> => {
    const response = await api.put(`/api/admin/content/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/content/${id}`);
  },

  // Student
  getAllPublished: (page = 0, size = 20) =>
    api.get(`/api/student/content/all?page=${page}&size=${size}`).then((res) => res.data),

  getPublishedByEntity: async (entityType: string, entityId: number): Promise<StudyMaterial[]> => {
    const response = await api.get(`/api/student/content/entity/${entityType}/${entityId}`);
    return response.data;
  },

  getContent: (id: number) =>
    api.get(`/api/student/content/${id}/view`).then((res) => res.data),

  downloadUrl: (id: number) => `${api.defaults.baseURL}/api/student/content/${id}/download`,
};
