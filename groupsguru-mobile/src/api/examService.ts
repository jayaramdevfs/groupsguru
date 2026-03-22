import { api } from "./api";
import { Exam } from "./types";

export const examService = {
  getAll: async (): Promise<Exam[]> => {
    const response = await api.get("/api/exams");
    return response.data;
  },

  getById: async (id: number): Promise<Exam> => {
    const response = await api.get(`/api/exams/${id}`);
    return response.data;
  },
};
