import { api } from "./api";
import { Question } from "./types";

export interface PaginatedQuestions {
  content: Question[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const questionService = {
  getAll: async (
    page = 0,
    size = 100,
    subject?: string,
    search?: string
  ): Promise<PaginatedQuestions> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (subject) params.append("subject", subject);
    if (search) params.append("search", search);
    const response = await api.get(`/api/admin/questions?${params.toString()}`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await api.get("/api/questions/count");
    return response.data;
  },
};
