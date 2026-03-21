import backendApi from "./api";

export interface ParentOption {
  entityType: string;
  entityId: number;
  name: string;
  price: number;
}

export interface AccessCheckResponse {
  hasAccess: boolean;
  price: number | null;
  parentOptions: ParentOption[];
}

export const accessApi = {
  checkAccess: async (entityType: string, entityId: number): Promise<AccessCheckResponse> => {
    const res = await backendApi.get(`/access/check/${entityType}/${entityId}`);
    return res.data;
  },
};
