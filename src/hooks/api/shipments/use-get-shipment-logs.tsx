import { apiClient } from "@/config/api-client";
import { PaginationType } from "@/types/base-types";
import { ShipmentLogType } from "@/types/shipment";
import { ShipmentStatus } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type Variables = {
  shipmentId: string;
  statuses?: ShipmentStatus[];
  search?: string;
  dateRange?: [Date | undefined, Date | undefined];
};

type Response = PaginationType<ShipmentLogType> & {
  msg: string;
};

export const useGetShipmentLogs = (variables: Variables) => {
  const { getToken } = useAuth();
  return useInfiniteQuery<Response>({
    initialPageParam: 1,
    queryKey: ["shipment", "logs", variables],
    queryFn: async ({ pageParam = 1 }) => {
      const { statuses, search, dateRange, shipmentId } = variables;

      const statusQuery =
        (statuses && (statuses.length > 0 ? statuses.join(",") : undefined)) ||
        undefined;

      const { data } = await apiClient.get(
        `/api/shipments/${shipmentId}/logs`,
        {
          params: {
            page: pageParam,
            search,
            statuses: statusQuery,
            dateFrom: dateRange?.[0],
            dateTo: dateRange?.[1]
          },
          headers: {
            Authorization: "Bearer " + getToken()
          }
        }
      );

      return data as Response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.nextPage ?? undefined;
    }
  });
};
