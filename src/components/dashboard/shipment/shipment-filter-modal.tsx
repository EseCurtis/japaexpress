/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonDefault } from "@/components/common/button";
import { ShipmentStatus } from "@prisma/client";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { ShipmentStatusIndicator } from "./shipment-status-indicator";

type ShipmentFilterModalPropsType = {
  setFilters: (...params: any) => void;
  setFiltersModalEnabled: (...params: any) => void;
  filters: {
    statuses: string[];
  };
};

export function ShipmentFilterModal({
  setFilters,
  setFiltersModalEnabled,
  filters
}: ShipmentFilterModalPropsType) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    filters.statuses
  );

  const shipmentStatuses = Object.values(ShipmentStatus);

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prevStatuses) =>
      prevStatuses.includes(status)
        ? prevStatuses.filter((s) => s !== status)
        : [...prevStatuses, status]
    );
  };

  const applyAction = () => {
    setFilters({ ...filters, statuses: selectedStatuses });
    setFiltersModalEnabled(false);
  };

  const resetAction = () => {
    setSelectedStatuses([]);
    setFilters({ ...filters, statuses: [] });
  };

  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 h-full w-full z-10"
    >
      <div
        className="absolute w-full h-full bg-black/5"
        onClick={() => setFiltersModalEnabled(false)}
      ></div>

      <motion.div
        initial={{
          x: 100
        }}
        animate={{
          x: 0
        }}
        exit={{ x: 100 }}
        className="absolute bg-white w-full max-w-[340px] h-full top-0 right-0 rounded-lg"
      >
        <div className="py-5 border-b px-5 flex items-center justify-between">
          <h3 className="font-bold">Search Filters</h3>

          <div className="w-auto flex gap-3">
            <ButtonDefault className="p-3 py-2" onClick={applyAction}>
              Apply
            </ButtonDefault>
            <ButtonDefault
              className="p-3 py-2 bg-transparent text-black border border-black"
              onClick={resetAction}
            >
              Reset
            </ButtonDefault>
          </div>
        </div>

        <div className="p-5">
          <h4 className="font-bold text-sm">Statuses</h4>
          <div className="flex gap-3 flex-wrap">
            {shipmentStatuses.map((status, index) => (
              <Fragment key={index}>
                <div
                  className={`cursor-pointer flex bg-blue-gray-50 gap-2 rounded-lg items-center pr-1  ${
                    selectedStatuses.includes(status) ? "" : ""
                  }`}
                  onClick={() => toggleStatus(status)}
                >
                  <ShipmentStatusIndicator status={status} />
                  {selectedStatuses.includes(status) && (
                    <FaTimes className="text-sm" />
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
