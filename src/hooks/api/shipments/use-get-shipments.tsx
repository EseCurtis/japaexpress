import { apiClient } from "@/config/api-client";
import { PaginationType } from "@/types/base-types";
import { ShipmentType } from "@/types/shipment";
import { ShipmentStatus } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type Variables = {
  statuses?: ShipmentStatus[];
  driversEmail?: string;
  customersEmail?: string;
  search?: string;
  dateRange?: [Date | undefined, Date | undefined];
};

type Response = PaginationType<ShipmentType> & {
  msg: string;
};

export const useGetShipments = (variables: Variables) => {
  const { getToken } = useAuth();
  return useInfiniteQuery<Response>({
    initialPageParam: 1,
    queryKey: ["shipments", variables],
    queryFn: async ({ pageParam = 1 }) => {
      const { statuses, driversEmail, customersEmail, search, dateRange } =
        variables;

      const statusQuery =
        (statuses && (statuses.length > 0 ? statuses.join(",") : undefined)) ||
        undefined;

      const { data } = await apiClient.get(`/api/shipments`, {
        params: {
          page: pageParam,
          search,
          statuses: statusQuery,
          driversEmail,
          customersEmail,
          dateFrom: dateRange?.[0],
          dateTo: dateRange?.[1]
        },
        headers: {
          Authorization: "Bearer " + getToken()
        }
      });

      return data as Response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.nextPage ?? undefined;
    }
  });
};
