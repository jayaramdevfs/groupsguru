import backendApi from "./api";

export const pricingApi = {
  updatePrice: async (entityType: string, entityId: number, priceInr: number | null) => {
    const res = await backendApi.put(`/admin/pricing/${entityType}/${entityId}`, {
      priceInr,
    });
    return res.data;
  },
};
