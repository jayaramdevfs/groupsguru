import { api } from "./api";

export interface PredictionScore {
  id: number;
  microTopicId: string;
  subject: string;
  predictionConfidence: number;
  priorityRank: string;
  notes?: string;
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

export const intelligenceService = {
  getTopPredictions: async (subject: string = "All Subjects", limit: number = 20): Promise<PredictionScore[]> => {
    const response = await api.get("/api/admin/intelligence/predictions");
    let data: PredictionScore[] = response.data;
    if (subject !== "All Subjects") {
        data = data.filter(d => d.subject === subject);
    }
    data.sort((a,b) => b.predictionConfidence - a.predictionConfidence);
    return data.slice(0, limit);
  },
  getContentGaps: async (): Promise<ContentGap[]> => {
    const response = await api.get("/api/admin/intelligence/content-gaps");
    return response.data;
  },
  getCoverage: async (): Promise<Coverage[]> => {
    const response = await api.get("/api/admin/intelligence/coverage");
    return response.data;
  }
};
