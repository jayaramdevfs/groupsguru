import { api } from "./api";

export interface PredictionScore {
  id: number;
  microTopicId: string;
  subject: string;
  predictionConfidence: number;
  priorityRank: string;
}

export const intelligenceService = {
  getTopPredictions: async (subject: string = "All Subjects", limit: number = 20): Promise<PredictionScore[]> => {
    // If "All Subjects", we should omit the subject param or let the backend handle it?
    // Wait, the backend default is "History" if omitted, let's just pass what we have.
    // If backend doesn't support "All Subjects", we can just fetch all predictions and sort/filter here,
    // but the backend API has `?subject=xxx`. Let's assume we can fetch all and filter client side if needed, or backend supports filtering.
    // Actually, backend findBySubject might not work for "All Subjects". Let's fetch all and slice.
    const response = await api.get("/api/admin/intelligence/predictions");
    let data: PredictionScore[] = response.data;
    if (subject !== "All Subjects") {
        data = data.filter(d => d.subject === subject);
    }
    data.sort((a,b) => b.predictionConfidence - a.predictionConfidence);
    return data.slice(0, limit);
  },
};
