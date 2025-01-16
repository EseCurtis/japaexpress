/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/config/database";
import RouteHandler from "@/utils/route-handler";
import { ShipmentStatus, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

// Add route for retrieving all shipments with number-based pagination and filters
routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, { shipmentId }, authUser) => {
        try {
            const { companyId } = authUser!;

            const shipment = await database.shipments.findUnique({
                where: { uuid: shipmentId, companyId: companyId! },
            });

            if (!shipment) {
                return { msg: "Shipment not found", status: 404 };
            }

            // Fetch the filtered shipments
            const shipmentLogs = await database.shipmentLogs.findMany({
                where: {
                    shipmentId,
                    companyId: companyId!
                },
            });


            const badStatuses = [ShipmentStatus.FAILED, ShipmentStatus.CANCELLED, ShipmentStatus.RETURNED];


            const inWarehouse = !shipmentLogs.some((log) => log.status === ShipmentStatus.PICKED);
            const pickedUp = shipmentLogs.some((log) => log.status === ShipmentStatus.PICKED);
            const inTransit = pickedUp && shipmentLogs.some((log) => log.status === ShipmentStatus.IN_TRANSIT) && !shipmentLogs.some((log) => log.status === ShipmentStatus.DELIVERED);
            const delivered = pickedUp && shipmentLogs.reverse()[0]?.status == ShipmentStatus.DELIVERED;

            const tracking = {
                inWarehouse: inTransit || pickedUp || inWarehouse,
                pickedUp: inTransit || delivered || pickedUp,
                inTransit: delivered || inTransit,
                delivered: delivered,
                currentStatusIsBad: badStatuses.includes(shipment.status as any)
            };


            return {
                msg: "Shipments retrieved successfully",
                data: {
                    tracking
                },
            };
        } catch (error) {
            console.error("Error retrieving shipments:", error);
            return { msg: "Internal server error", status: 500 };
        }
    },
    "GET",
    [UserRole.CUSTOMER, UserRole.DELIVERY_PARTNER, UserRole.MANAGER] // Role-based access
);

// Handle GET request for retrieving all shipments (number-based pagination with filters)
export async function GET(req: NextRequest, { params }: { params: any }) {
    const { id: shipmentId } = await params;
    return routeHandler.handle(req, { shipmentId });
}
