import { UserRole } from "@prisma/client";

export type AuthUserType = {
    companyId: string | null;
    userId: string,
    email: string,
    role: UserRole
}

export type ProfileType = {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    isConfirmed: boolean;
}