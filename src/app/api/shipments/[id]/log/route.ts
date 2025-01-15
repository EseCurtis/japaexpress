/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/app/config/database";
import { locationUpdateSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    locationUpdateSchema,
    async (req: NextRequest, body, { shipmentId }, authUser) => {
        const { companyId } = authUser!;
        const { longitude, latitude, timestamp, status, error } = body;

        try {
            // Check if the shipment exists
            const shipment = await database.shipments.findUnique({
                where: { uuid: shipmentId, companyId: companyId! },
            });

            if (!shipment) {
                return { msg: "Shipment not found", status: 404 };
            }

            // Update the shipment's location and status
            const updatedShipment = await database.shipmentLogs.create({
                data: {
                    longitude,
                    latitude,
                    timestamp,
                    status,
                    shipmentId,
                    companyId: companyId!,
                    error: String(error)
                },
            });

            return {
                msg: "Shipment location logged successfully",
                data: updatedShipment,
            };
        } catch (error) {
            console.error("Error updating shipment:", error);
            return { msg: "Error updating shipment", status: 500 };
        }
    },
    "POST",
    [UserRole.DELIVERY_PARTNER, UserRole.MANAGER]
);

export async function POST(req: NextRequest, { params }: { params: any }) {
    const { id: shipmentId } = await params;

    return routeHandler.handle(req, { shipmentId });
}
