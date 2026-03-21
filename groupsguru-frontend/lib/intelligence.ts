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
  recalculateScores: async (): Promise<void> => {
    await api.post("/api/admin/intelligence/predictions/recalculate");
  }
};
