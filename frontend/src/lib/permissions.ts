import { UserRole } from "@/generated/prisma";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const allPostPermissions = [
  "create",
  "read",
  "update",
  "delete",
  "update:own",
  "delete:own",
] as const;

const ownPostPermissions = [
  "create",
  "read",
  "update:own",
  "delete:own",
] as const;

const statements = {
  ...defaultStatements,
  posts: allPostPermissions,
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  [UserRole.USER]: ac.newRole({
    posts: [...ownPostPermissions],
  }),
  [UserRole.ADMIN]: ac.newRole({
    ...adminAc.statements,
    posts: [...allPostPermissions],
  }),
};
