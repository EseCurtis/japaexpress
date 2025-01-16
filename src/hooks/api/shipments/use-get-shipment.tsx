/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/config/api-client";
import { ProfileType } from "@/types/base-types";
import { ShipmentType } from "@/types/shipment";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../use-auth";

type Variables = {
  shipmentId: string;
};

type Response = ShipmentType & {
  manager: ProfileType;
};

export const useGetShipment = (variables: Variables) => {
  const { getToken } = useAuth();
  return useQuery<Response>({
    queryKey: ["shipment", variables.shipmentId],
    queryFn: async () => {
      const { shipmentId } = variables;

      const { data } = (await apiClient.get(`/api/shipments/${shipmentId}`, {
        headers: {
          Authorization: "Bearer " + getToken()
        }
      })) as any;

      return data.data as Response;
    }
  });
};
