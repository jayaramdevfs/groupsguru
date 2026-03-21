import api from "./api";
import { Exam, ExamRequest } from "./types";

export const examsApi = {
  getAll: async (): Promise<Exam[]> => {
    const response = await api.get("/api/exams");
    return response.data;
  },

  getAllAdmin: async (): Promise<Exam[]> => {
    const response = await api.get("/api/admin/exams");
    return response.data;
  },

  getById: async (id: number): Promise<Exam> => {
    const response = await api.get(`/api/exams/${id}`);
    return response.data;
  },

  create: async (data: ExamRequest): Promise<Exam> => {
    const response = await api.post("/api/admin/exams", data);
    return response.data;
  },

  update: async (id: number, data: Partial<ExamRequest>): Promise<Exam> => {
    const response = await api.put(`/api/admin/exams/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/exams/${id}`);
  },

  assignQuestions: async (id: number, questionIds: number[]): Promise<void> => {
    await api.post(`/api/admin/exams/${id}/assign-questions`, { questionIds });
  },

  getAssignedQuestions: async (id: number): Promise<number[]> => {
    const response = await api.get(`/api/admin/exams/${id}/assigned-questions`);
    return response.data;
  },
};
