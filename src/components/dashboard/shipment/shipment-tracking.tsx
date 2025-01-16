 
import { ShipmentType } from "@/types/shipment";
import { ShipmentTrackingMap } from "./shipment-tracking-map";
import { ShipmentTrackingTimeline } from "./shipment-tracking-timeline";

export function ShipmentTracking({ shipment }: { shipment: ShipmentType }) {
  return (
    <div className=" flex flex-col bg-blue-gray-50 w-full h-full rounded-lg p-5 ">
      <ShipmentTrackingMap shipment={shipment} />
      <ShipmentTrackingTimeline shipment={shipment} />
    </div>
  );
}
