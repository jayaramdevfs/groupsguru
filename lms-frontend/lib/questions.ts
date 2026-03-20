import api from "./api";
import { Question, QuestionRequest } from "./types";

export interface PaginatedQuestions {
  content: Question[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const questionsApi = {
  getAll: async (
    page = 0,
    size = 100,
    subject?: string,
    difficulty?: string,
    questionType?: string,
    sprintId?: string,
    search?: string
  ): Promise<PaginatedQuestions> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (subject) params.append("subject", subject);
    if (difficulty) params.append("difficulty", difficulty);
    if (questionType) params.append("questionType", questionType);
    if (sprintId) params.append("sprintId", sprintId);
    if (search) params.append("search", search);

    const response = await api.get(`/api/admin/questions?${params.toString()}`);
    return response.data;
  },

  getById: async (id: number): Promise<Question> => {
    const response = await api.get(`/api/questions/${id}`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await api.get("/api/questions/count");
    return response.data;
  },

  create: async (data: QuestionRequest): Promise<Question> => {
    const response = await api.post("/api/admin/questions", data);
    return response.data;
  },

  update: async (id: number, data: Partial<QuestionRequest>): Promise<Question> => {
    const response = await api.put(`/api/admin/questions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/questions/${id}`);
  },
};
