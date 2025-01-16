import { UserRole } from "@prisma/client";

export type AuthUserType = {
    companyId: string | null;
    userId: string,
    email: string,
    role: UserRole
}

export type CompanyType = {
    name: string;
    phone: string;
    uuid: string;
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
    company: CompanyType | null;
    companyId?: string;
}

export type PaginationType<ListType> = {
    data: ListType[]
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        nextPage: number | null
    }
}

export type PaginateQuery<T> = {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
};


