import { UserRole } from "@/generated/prisma";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const ac = createAccessControl(defaultStatements);

export const roles = {
  [UserRole.USER]: ac.newRole({ user: [], session: [] }),
  [UserRole.ADMIN]: ac.newRole({ ...adminAc.statements }),
};
