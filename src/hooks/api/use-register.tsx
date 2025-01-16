/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/config/api-client";
import { ProfileType } from "@/types/base-types";
import { useMutation } from "@tanstack/react-query";

type Variables = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type Response = ProfileType;

export const useRegister = () => {
    return useMutation<Response, any, Variables>({
        mutationFn: async (variables) => {
            const { data } = await apiClient.post("/api/auth/register", variables) as any;
            return data.data as ProfileType;
        },
    });
};
