import { api } from "./api";
import { StudyMaterial } from "./types";

export const studyMaterialService = {
  getByEntity: async (entityType: string, entityId: number): Promise<StudyMaterial[]> => {
    const response = await api.get<StudyMaterial[]>(`/api/student/content/entity/${entityType}/${entityId}`);
    return response.data;
  },

  getDownloadUrl: (id: number): string => {
    // This returns the full URL with the authentication token potentially handled by the interceptor
    const baseURL = api.defaults.baseURL;
    return `${baseURL}/api/student/content/${id}/download`;
  },

  fetchContent: async (id: number): Promise<string> => {
    // Specifically for Markdown/Text files
    const response = await api.get(`/api/student/content/${id}/download`, {
      responseType: 'text'
    });
    return response.data;
  }
};
