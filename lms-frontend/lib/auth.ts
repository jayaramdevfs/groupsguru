export type UserRole = "ADMIN" | "STUDENT";

export interface AuthMeData {
  email: string;
  role: UserRole;
}

export const isUserRole = (value: unknown): value is UserRole => {
  return value === "ADMIN" || value === "STUDENT";
};
