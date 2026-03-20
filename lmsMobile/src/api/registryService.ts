import { api } from "./api";
import { MicroTopic } from "./types";

export interface PaginatedMicroTopics {
  content: MicroTopic[];
  totalElements: number;
}

export const registryService = {
  getPublicMicroTopics: async (): Promise<PaginatedMicroTopics> => {
    try {
      // Fetch up to 1000 to get all 875 micro-topics
      const response = await api.get("/api/registry/micro-topics?page=0&size=1000");
      return response.data;
    } catch (error) {
      console.error("Fetch micro-topics failed:", error);
      throw error;
    }
  },
};
