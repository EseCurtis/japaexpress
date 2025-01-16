/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonDefault } from "@/components/common/button";
import { useGetShipmentLogs } from "@/hooks/api/shipments/use-get-shipment-logs";
import { ShipmentLogType, ShipmentType } from "@/types/shipment";
import { normalizePaginated } from "@/utils/helpers";
import { Fragment } from "react";
import { ShipmentStatusIndicator } from "./shipment-status-indicator";

export function ShipmentTrackingTimeline({
  shipment
}: {
  shipment: ShipmentType;
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching
  } = useGetShipmentLogs({
    shipmentId: String(shipment?.uuid)
  });
  const shipmentLogs = normalizePaginated<ShipmentLogType>(data as any);
  return (
    <div className="overflow-y-scroll h-[50vh]">
      <div className=" p-3 w-full">
        <h3 className="font-bold text-sm">Shipment Timeline</h3>
      </div>
      {shipmentLogs.map((log, index) => {
        return (
          <Fragment key={index}>
            <div>
              {index > 0 && (
                <div className="grid grid-cols-9">
                  <div className="col-span-1  h-3 flex items-start justify-center "></div>
                </div>
              )}
              <div className={`grid grid-cols-9 items-start justify-start`}>
                <div className="col-span-1 flex flex-col items-center justify-start h-full">
                  <div className="bg-black rounded-full w-3 h-3 aspect-square"></div>
                  <div className="min-h-5 h-full bg-black rounded-lg w-0.5  -translate-y-2 opacity-20"></div>
                </div>
                <div className="col-span-8 pl-5 flex items-start ">
                  <div className="flex flex-col">
                    <ShipmentStatusIndicator status={log.status} />
                    <p className="text-xs  my-1"> {log.error}</p>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })}

      <div className="flex items-center justify-center">
        {hasNextPage ? (
          <ButtonDefault
            onClick={fetchNextPage}
            className="text-xs px-3 py-2 rounded-lg"
            loading={isLoading || isFetchingNextPage || isFetching}
          >
            Load more
          </ButtonDefault>
        ) : (
          <span className="bg-blue-gray-50 px-3 py-1 rounded-md border text-sm">
            You&apos;re all caught up!
          </span>
        )}
      </div>
    </div>
  );
}
