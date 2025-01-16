import { useGetShipmentTrackingMap } from "@/hooks/api/shipments/use-get-shipment-tracking-map";
import { ShipmentType } from "@/types/shipment";
import { FaCheck, FaTimes } from "react-icons/fa";
import { ShipmentStatusIndicator } from "./shipment-status-indicator";

const SuccessIcon = () => {
  return <FaCheck className="text-green-500 scale-150" />;
};

const ErrorIcon = () => {
  return <FaTimes className="text-red-600" />;
};

const PendingIcon = () => {
  return <span className="w-2 h-2 aspect-square bg-white rounded-full"></span>;
};

export function ShipmentTrackingMap({ shipment }: { shipment: ShipmentType }) {
  const { data: trackingMapData } = useGetShipmentTrackingMap({
    shipmentId: String(shipment?.uuid)
  });
  const trackingMap = trackingMapData?.tracking;

  return (
    <div className=" p-3">
      <div className="flex gap-3 pb-3 w-full">
        <h3 className="font-bold text-sm">Shipment Tracking Map</h3>
        <ShipmentStatusIndicator status={shipment.status} />
      </div>

      <div className="bg-black rounded-lg p-3">
        <div className="flex gap-1 items-center">
          {(trackingMap?.inWarehouse &&
            (trackingMap?.currentStatusIsBad ? (
              <ErrorIcon />
            ) : (
              <SuccessIcon />
            ))) || <PendingIcon />}
          <span
            className={`h-0.5 w-full rounded-full ${
              trackingMap?.pickedUp ? "bg-green-500" : "bg-white"
            }`}
          ></span>
          {(trackingMap?.pickedUp &&
            (trackingMap?.currentStatusIsBad ? (
              <ErrorIcon />
            ) : (
              <SuccessIcon />
            ))) || <PendingIcon />}
          <span
            className={`h-0.5 w-full rounded-full ${
              trackingMap?.inTransit ? "bg-green-500" : "bg-white"
            }`}
          ></span>
          {(trackingMap?.inTransit &&
            (trackingMap?.currentStatusIsBad ? (
              <ErrorIcon />
            ) : (
              <SuccessIcon />
            ))) || <PendingIcon />}
          <span
            className={`h-0.5 w-full rounded-full ${
              trackingMap?.delivered ? "bg-green-500" : "bg-white"
            }`}
          ></span>
          {(trackingMap?.delivered &&
            (trackingMap?.currentStatusIsBad ? (
              <ErrorIcon />
            ) : (
              <SuccessIcon />
            ))) || <PendingIcon />}
        </div>

        <div className="flex justify-between items-center text-white text-xs text-center pt-3 ">
          <span>Warehouse</span>
          <span>Picked up</span>
          <span>In Transit</span>
          <span>Delivered</span>
        </div>
      </div>
    </div>
  );
}
