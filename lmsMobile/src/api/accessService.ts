import { api } from './api';
import { AccessCheckResponse } from './accessTypes';

export const accessService = {
  checkAccess: async (entityType: string, entityId: number | string): Promise<AccessCheckResponse> => {
    const response = await api.get(`/access/check/${entityType}/${entityId}`);
    return response.data;
  },
};
