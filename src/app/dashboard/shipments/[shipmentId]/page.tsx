"use client";

import { ButtonDefault } from "@/components/common/button";
import { ShipmentTracking } from "@/components/dashboard/shipment/shipment-tracking";
import { useGetShipment } from "@/hooks/api/shipments/use-get-shipment";
import { ShipmentType } from "@/types/shipment";
import { useParams } from "next/navigation";

export default function ShipmentInfo({}) {
  const { shipmentId } = useParams();
  const { data, isLoading } = useGetShipment({
    shipmentId: String(shipmentId)
  });

  return (
    !isLoading && (
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3">
            <div className="w-full flex gap-3 mb-3">
                <ButtonDefault>Update Shipment Detail</ButtonDefault>
                <ButtonDefault>Update Tracking Info</ButtonDefault>
            </div>

          <div className="bg-blue-gray-50 p-3 rounded-lg text-sm">
            <div className="p-3">
              <b>Shipment Description</b>
              <p>{data?.description}</p>
            </div>

            <div className="p-3">
              <b>Delivery Address</b>
              <p>{data?.deliveryAddress}</p>
            </div>

            <div className="p-3">
              <b>Pickup Address</b>
              <p>{data?.pickupAddress}</p>
            </div>

            <div className="p-3">
              <b>Driver&apos;s Email</b>
              <p>{data?.driversEmail}</p>
            </div>

            <div className="p-3">
              <b>Customer&apos;s Email</b>
              <p>{data?.customersEmail}</p>
            </div>
          </div>
        </div>
        <div className="col-span-2 h-full overflow-clip">
          <ShipmentTracking shipment={data as ShipmentType} />
        </div>
      </div>
    )
  );
}
