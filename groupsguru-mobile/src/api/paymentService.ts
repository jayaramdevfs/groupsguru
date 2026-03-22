import { api } from './api';

export const paymentService = {
  createOrder: async (entityType: string, entityId: number): Promise<string> => {
    const res = await api.post('/payments/create-order', { entityType, entityId });
    return res.data.data;
  },

  verifyPayment: async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<void> => {
    await api.post('/payments/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
  },
};
