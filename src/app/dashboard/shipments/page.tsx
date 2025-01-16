/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { TableDefault } from "@/components/common/table";
import { useGetShipments } from "@/hooks/api/shipments/use-get-shipments";
import { ShipmentType } from "@/types/shipment";
import { gridCols, normalizePaginated, shortenEmail } from "@/utils/helpers";
import { ShipmentStatus } from "@prisma/client";

export default function Dashboard() {
  const { data, fetchNextPage, hasNextPage } = useGetShipments({
    statuses: [ShipmentStatus.PENDING]
  });
  const shipments = normalizePaginated<ShipmentType>(data as any);

  const tableData = {
    data: shipments,
    fields: [
      "S/N",

      (item: ShipmentType) => {
        return (
          <span className="overflow-hidden w-full bg-blue-gray-50 px-1 rounded-xl text-xs">
            {item.uuid}
          </span>
        );
      },
      "status",
      (item: ShipmentType) => {
        return (
          <span className="overflow-hidden w-full bg-blue-gray-50 px-1 rounded-xl text-xs">
            {shortenEmail(item.driversEmail, 2)}
          </span>
        );
      },
      (item: ShipmentType) => {
        return (
          <span className="overflow-hidden w-full bg-blue-gray-50 px-1 rounded-xl text-xs">
            {shortenEmail(item.customersEmail, 2)}
          </span>
        );
      },
      (item: ShipmentType) => {
        return (
          <div className="flex gap-3">
            <span className="text-xs bg-">Details</span>
            <span className="text-xs bg-">Edit</span>
            <span className="text-xs bg-">Delete</span>
          </div>
        );
      }
    ]
  };

  return (
    <div className="">
      <h1 className="text-3xl">{}</h1>
      <div className="">
        <TableDefault
          transform
          tableData={tableData}
          placeholder={"No Data!"}
          rowOperation={{ onClick(item) {}, exempt: [] }}
          isLoading={false}
          dimensions={gridCols("0.7,3,1,2,2,1,1")}
          tableHeader={[
            "S/N",
            "Shipment ID",
            "Status",
            "Driver Email",
            "Customer Email",
            "Actions"
          ]}
          rowClassName={""}
        />
      </div>
    </div>
  );
}
