import api from './api';
import { TestSeries, TestSeriesRequest, Exam } from './types';

export const testSeriesApi = {
  // Admin endpoints
  getAllAdmin: async (): Promise<TestSeries[]> => {
    const response = await api.get('/admin/test-series');
    return response.data;
  },

  create: async (data: TestSeriesRequest): Promise<TestSeries> => {
    const response = await api.post('/admin/test-series', data);
    return response.data;
  },

  update: async (id: number, data: TestSeriesRequest): Promise<TestSeries> => {
    const response = await api.put(`/admin/test-series/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/test-series/${id}`);
  },

  getById: async (id: number): Promise<TestSeries> => {
    const response = await api.get(`/admin/test-series/${id}`);
    return response.data;
  },

  assignExams: async (id: number, examIds: number[]): Promise<void> => {
    await api.put(`/admin/test-series/${id}/exams`, { examIds });
  },

  getSeriesExams: async (id: number): Promise<Exam[]> => {
    const response = await api.get(`/admin/test-series/${id}/exams`);
    return response.data;
  },

  autoGenerate: async (id: number, questionsPerExam: number, numExams: number): Promise<void> => {
    await api.post(`/admin/test-series/${id}/auto-generate`, { questionsPerExam, numExams });
  },

  // Student endpoints
  getAllStudent: async (): Promise<TestSeries[]> => {
    const response = await api.get('/student/test-series');
    return response.data;
  },

  getStudentSeriesDetail: async (id: number): Promise<TestSeries> => {
    const response = await api.get(`/student/test-series/${id}`);
    return response.data;
  },

  getStudentSeriesExams: async (id: number): Promise<Exam[]> => {
    const response = await api.get(`/student/test-series/${id}/exams`);
    return response.data;
  }
};
