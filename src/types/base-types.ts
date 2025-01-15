import { UserRole } from "@prisma/client";

export type AuthUserType = {
    companyId: string | null;
    userId: string,
    email: string,
    role: UserRole
}