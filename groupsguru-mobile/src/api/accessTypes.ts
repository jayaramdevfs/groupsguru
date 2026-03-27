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
