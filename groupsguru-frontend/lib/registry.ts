import api from "./api";
import { MicroTopic, MicroTopicRequest } from "./types";

export interface PaginatedMicroTopics {
  content: MicroTopic[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const registryApi = {
  getMicroTopics: async (
    page = 0,
    size = 100,
    subject?: string,
    paper?: string,
    groupApplicability?: string
  ): Promise<PaginatedMicroTopics> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      if (subject) params.append("subject", subject);
      if (paper) params.append("paper", paper);
      if (groupApplicability) params.append("groupApplicability", groupApplicability);

      const response = await api.get(`/api/admin/registry/micro-topics?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch micro-topics:", error);
      throw error;
    }
  },

  getPublicMicroTopics: async (
    page = 0,
    size = 100,
    subject?: string,
    paper?: string,
    groupApplicability?: string
  ): Promise<PaginatedMicroTopics> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });
      if (subject) params.append("subject", subject);
      if (paper) params.append("paper", paper);
      if (groupApplicability) params.append("groupApplicability", groupApplicability);

      const response = await api.get(`/api/registry/micro-topics?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch public micro-topics:", error);
      throw error;
    }
  },

  getMicroTopicsByTopic: async (topicId: number): Promise<MicroTopic[]> => {
    try {
      const response = await api.get(`/api/registry/micro-topics/topic/${topicId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch micro-topics by topic:", error);
      throw error;
    }
  },


  createMicroTopic: async (data: MicroTopicRequest): Promise<MicroTopic> => {
    const response = await api.post("/api/admin/registry/micro-topics", data);
    return response.data;
  },

  updateMicroTopic: async (
    microTopicId: string,
    data: Partial<MicroTopicRequest>
  ): Promise<MicroTopic> => {
    const response = await api.patch(`/api/admin/registry/micro-topics/${microTopicId}`, data);
    return response.data;
  },

  deleteMicroTopic: async (microTopicId: string): Promise<void> => {
    await api.delete(`/api/admin/registry/micro-topics/${microTopicId}`);
  },
};
