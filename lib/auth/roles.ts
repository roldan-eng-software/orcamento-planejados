export const Roles = {
  customer: "CUSTOMER",
  admin: "ADMIN",
  superAdmin: "SUPER_ADMIN",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export function isAdminRole(role: string | null | undefined) {
  return role === Roles.admin || role === Roles.superAdmin;
}
