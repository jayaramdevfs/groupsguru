import { api } from "./api";
import { AttemptStartResponse, ExamAttempt, SubmitAttemptRequest } from "./types";

export const attemptService = {
  start: async (examId: number): Promise<AttemptStartResponse> => {
    const response = await api.post(`/api/exams/${examId}/start`);
    return response.data;
  },

  submit: async (attemptId: number, data: SubmitAttemptRequest): Promise<ExamAttempt> => {
    const response = await api.post(`/api/exams/attempts/${attemptId}/submit`, data);
    return response.data;
  },

  getMyAttempts: async (): Promise<ExamAttempt[]> => {
    const response = await api.get("/api/exams/my-attempts");
    return response.data;
  },
};
