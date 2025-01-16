/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/config/api-client";
import { useMutation } from "@tanstack/react-query";

type Variables = {
  email: string;
};

type Response = {
  user: {
    requestedConfirmation: boolean;
  };
};

export const useRequestConfirmation = () => {
  return useMutation<Response, any, Variables>({
    mutationFn: async (variables) => {
      const { data } = (await apiClient.post(
        "/api/auth/request-confirmation",
        variables
      )) as any;
      return data.data;
    }
  });
};