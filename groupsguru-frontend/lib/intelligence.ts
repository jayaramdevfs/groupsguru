import api from "./api";

export interface PredictionScore {
  id: number;
  microTopicId: string;
  subject: string;
  frequencyScore: number;
  depthScore: number;
  recurrenceScore: number;
  caLinkedBoost: number;
  syllabusPriority: number;
  trendMomentum: number;
  dataConfidence: string;
  predictionConfidence: number;
  priorityRank: string;
  notes: string;
}

export interface PyqAnalysis {
  id: number;
  pyqId: string;
  commission: string;
  year: number;
  paper: string;
  questionNumber: string;
  subject: string;
  microTopicId: string;
  questionType: string;
  cognitiveLevel: string;
  difficulty: string;
  recurrence: string;
  caLinked: boolean;
  questionSummary: string;
}

export interface ContentGap {
  microTopicId: string;
  microTopicText: string;
  subject: string;
  predictionConfidence: number;
  priorityRank: string;
  questionCount: number;
}

export interface Coverage {
  subject: string;
  totalTopics: number;
  coveredTopics: number;
  coveragePercentage: number;
  totalQuestions: number;
}

export const intelligenceApi = {
  getPredictions: async (): Promise<PredictionScore[]> => {
    const res = await api.get("/api/admin/intelligence/predictions");
    return res.data;
  },
  getTopPredictions: async (subject: string, limit: number = 100): Promise<PredictionScore[]> => {
    const res = await api.get(`/api/admin/intelligence/predictions/top?subject=${subject}&limit=${limit}`);
    return res.data;
  },
  getPyqStats: async (): Promise<{ totalPyqs: number }> => {
    const res = await api.get("/api/admin/intelligence/pyq-analysis/stats");
    return res.data;
  },
  getContentGaps: async (): Promise<ContentGap[]> => {
    const res = await api.get("/api/admin/intelligence/content-gaps");
    return res.data;
  },
  getCoverage: async (): Promise<Coverage[]> => {
    const res = await api.get("/api/admin/intelligence/coverage");
    return res.data;
  },
  updateNotes: async (id: number, notes: string): Promise<void> => {
    await api.put(`/api/admin/intelligence/predictions/${id}/notes`, { notes });
  },
  updatePriority: async (id: number, priority: string): Promise<void> => {
    await api.put(`/api/admin/intelligence/predictions/${id}/priority-tweak`, { priority });
  },
  recalculateScores: async (): Promise<void> => {
    await api.post("/api/admin/intelligence/predictions/recalculate");
  }
};
