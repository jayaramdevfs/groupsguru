import backendApi from "./api";

export interface ParentOption {
  entityType: string;
  entityId: number;
  name: string;
  price: number;
  packageType?: string;
}

export interface AccessCheckResponse {
  hasAccess: boolean;
  price: number | null;
  parentOptions: ParentOption[];
}

export const accessApi = {
  checkAccess: async (entityType: string, entityId: number): Promise<AccessCheckResponse> => {
    const res = await backendApi.get(`/api/access/check/${entityType}/${entityId}`);
    return res.data;
  },
};
