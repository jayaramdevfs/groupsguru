import backendApi from "./api";

export const paymentApi = {
  createOrder: async (entityType: string, entityId: number): Promise<string> => {
    const res = await backendApi.post("/payments/create-order", { entityType, entityId });
    return res.data.data;
  },
  verifyPayment: async (orderId: string, paymentId: string, signature: string): Promise<void> => {
    await backendApi.post("/payments/verify", {
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature
    });
  }
};
