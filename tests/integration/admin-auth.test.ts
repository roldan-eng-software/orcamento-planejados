import { describe, expect, it } from "vitest";
import { isAdminRole, Roles } from "@/lib/auth/roles";

describe("admin authorization", () => {
  it("allows admin and super admin roles only", () => {
    expect(isAdminRole(Roles.admin)).toBe(true);
    expect(isAdminRole(Roles.superAdmin)).toBe(true);
    expect(isAdminRole(Roles.customer)).toBe(false);
  });
});
