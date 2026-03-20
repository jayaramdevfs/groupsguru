import { api } from "./api";
import { Topic } from "./types";

export const topicService = {
  getAll: async (): Promise<Topic[]> => {
    try {
      const response = await api.get("/api/topics");
      return response.data;
    } catch (error) {
      console.error("Fetch topics failed:", error);
      throw error;
    }
  },

  getBySectionId: async (sectionId: number): Promise<Topic[]> => {
    try {
      const response = await api.get(`/api/topics/section/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error(`Fetch topics for section ${sectionId} failed:`, error);
      throw error;
    }
  },
};
