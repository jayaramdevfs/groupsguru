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
