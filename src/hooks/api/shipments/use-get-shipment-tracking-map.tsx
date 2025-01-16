/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/config/api-client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type Variables = {
  shipmentId: string;
};

type Response = {
  tracking: {
    inWarehouse: boolean;
    pickedUp: boolean;
    inTransit: boolean;
    delivered: boolean;
    currentStatusIsBad: boolean;
  };
};

export const useGetShipmentTrackingMap = (variables: Variables) => {
  const { getToken } = useAuth();
  return useQuery<Response>({
    queryKey: ["shipment", variables.shipmentId, "tracking-map"],
    queryFn: async () => {
      const { shipmentId } = variables;

      const { data } = (await apiClient.get(
        `/api/shipments/${shipmentId}/tracking-map`,
        {
          headers: {
            Authorization: "Bearer " + getToken()
          }
        }
      )) as any;

      return data.data as Response;
    }
  });
};
