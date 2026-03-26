import api from "./api";

export interface QuestionBatch {
  id: number;
  batchName: string;
  fileName: string;
  fileFormat: string;
  totalQuestions: number;
  successCount: number;
  failCount: number;
  status: string; // UPLOADED | REVIEWING | APPROVED | REJECTED
  uploadedBy: number;
  reviewedBy?: number;
  uploadedAt: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
}

export const bulkUploadApi = {
  upload: async (file: File): Promise<QuestionBatch> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/admin/questions/bulk/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getBatches: async (page = 0, size = 20): Promise<{ content: QuestionBatch[]; totalElements: number; totalPages: number }> => {
    const response = await api.get(`/api/admin/questions/bulk/batches?page=${page}&size=${size}`);
    return response.data;
  },

  getBatch: async (id: number): Promise<QuestionBatch> => {
    const response = await api.get(`/api/admin/questions/bulk/batches/${id}`);
    return response.data;
  },

  getBatchQuestions: async (id: number): Promise<any[]> => {
    const response = await api.get(`/api/admin/questions/bulk/batches/${id}/questions`);
    return response.data;
  },

  approveBatch: async (id: number): Promise<QuestionBatch> => {
    const response = await api.put(`/api/admin/questions/bulk/batches/${id}/approve`);
    return response.data;
  },

  rejectBatch: async (id: number): Promise<QuestionBatch> => {
    const response = await api.put(`/api/admin/questions/bulk/batches/${id}/reject`);
    return response.data;
  },

  getCount: async (): Promise<number> => {
    const response = await api.get("/api/admin/questions/bulk/count");
    return response.data;
  },
};
