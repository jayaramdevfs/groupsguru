import { api } from "./api";
import { MicroTopic } from "./types";

export interface PaginatedMicroTopics {
  content: MicroTopic[];
}

export const registryService = {
  getPublicMicroTopics: async (): Promise<PaginatedMicroTopics> => {
    try {
      // Just fetch the first 500 for demo on mobile 
      const response = await api.get("/api/registry/micro-topics?page=0&size=500");
      return response.data;
    } catch (error) {
      console.error("Fetch micro-topics failed:", error);
      throw error;
    }
  },
};
