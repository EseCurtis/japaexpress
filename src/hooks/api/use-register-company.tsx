/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/config/api-client";
import { CompanyType } from "@/types/base-types";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

type Variables = {
  name: string;
  address: string;
  phone: string;
};

type Response = CompanyType;

export const useRegisterCompany = () => {
  const { getToken } = useAuth();
  return useMutation<Response, any, Variables>({
    mutationFn: async (variables) => {
      const { data } = (await apiClient.post(
        "/api/company/register",
        variables,
        {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        }
      )) as any;
      return data.data as CompanyType;
    }
  });
};
