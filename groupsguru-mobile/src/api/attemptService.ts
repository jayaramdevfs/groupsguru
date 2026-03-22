import { api } from "./api";
import { AttemptStartResponse, ExamAttempt, ExamResult, SubmitAttemptRequest } from "./types";

export const attemptService = {
  getResult: async (attemptId: number): Promise<ExamResult> => {
    const response = await api.get(`/api/exams/attempts/${attemptId}/result`);
    return response.data;
  },
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
