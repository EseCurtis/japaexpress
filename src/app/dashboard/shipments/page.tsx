/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ButtonDefault } from "@/components/common/button";
import { DatePickerDefault } from "@/components/common/date-picker";
import { InputDefault } from "@/components/common/input";
import { TableDefault } from "@/components/common/table";
import { ShipmentFilterModal } from "@/components/dashboard/shipment/shipment-filter-modal";
import { ShipmentStatusIndicator } from "@/components/dashboard/shipment/shipment-status-indicator";
import { useGetShipments } from "@/hooks/api/shipments/use-get-shipments";
import { ShipmentType } from "@/types/shipment";
import { gridCols, normalizePaginated, shortenEmail } from "@/utils/helpers";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoMdFunnel } from "react-icons/io";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [filtersModalEnabled, setFiltersModalEnabled] = useState(false);
  const [dateRange, setDateRange] = useState<
    [Date | undefined, Date | undefined]
  >([undefined, undefined]);
  const [filters, setFilters] = useState({
    statuses: []
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching
  } = useGetShipments({
    statuses: filters.statuses,
    search,
    dateRange
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
      (item: ShipmentType) => {
        return <ShipmentStatusIndicator status={item.status} />;
      },
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
      () => {
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
    <div className="flex flex-col">
      <AnimatePresence>
        {filtersModalEnabled && (
          <ShipmentFilterModal
            setFilters={setFilters}
            filters={filters}
            setFiltersModalEnabled={setFiltersModalEnabled}
          />
        )}
      </AnimatePresence>
      <div className="text-3xl flex justify- items-center w-full pb-5 gap-3">
        {search?.length > 0 && (
          <div className="text-sm font-bold">
            Search ({search}) - {shipments.length} result
            {shipments.length > 1 && "s"}
          </div>
        )}
        <DatePickerDefault
          onChange={(value) => {
            setDateRange([value?.[0], value?.[1]]);
          }}
        />

        <ButtonDefault
          className="py-3 w-auto m-0 ml-auto"
          onClick={() => setFiltersModalEnabled(!filtersModalEnabled)}
        >
          <span className="flex items-center gap-2 ">
            Filters <IoMdFunnel />
            {filters.statuses.length > 0 && <>({filters.statuses.length})</>}
          </span>
        </ButtonDefault>

        <div className=" -translate-y-1">
          <InputDefault
            label="Search in Shipments"
            className="!m-0"
            onChange={(e) => {
              setSearch(e.currentTarget.value);
            }}
          />
        </div>
      </div>

      <hr />
      <div className="">
        <TableDefault
          transform
          tableData={tableData}
          placeholder={
            <div className="w-full p-3 flex items-center justify-center">
              <p className="text-sm">No Records yet</p>
            </div>
          }
          rowOperation={{ onClick() {}, exempt: [] }}
          isLoading={isLoading || isFetchingNextPage || isFetching}
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

        <div className="w-full flex items-center justify-center pb-10">
          {hasNextPage ? (
            <ButtonDefault
              onClick={fetchNextPage}
              className="text-xs"
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
    </div>
  );
}
