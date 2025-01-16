/* eslint-disable @typescript-eslint/no-explicit-any */

import database from "@/config/database";
import { stripSensitiveProperties } from "@/utils/helpers";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

// Add route for creating feedback for shipment
routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, { shipmentId }, authUser) => {
        try {
            const { companyId } = authUser!;

            // Find the shipment by shipmentId
            const shipment = await database.shipments.findUnique({
                where: { uuid: shipmentId, companyId: companyId! },
                include: {
                    logs: true,
                    manager: true
                }
            });

            if (!shipment) {
                return { msg: "Shipment not found", status: 404 };
            }

            return {
                msg: "Shipment retrieved successfully",
                data: stripSensitiveProperties(shipment, ["id"]),
            };

        } catch (error) {
            console.error("Error creating feedback:", error);
            return { msg: "Internal server error", status: 500 };
        }
    },
    "GET",
    [UserRole.CUSTOMER, UserRole.DELIVERY_PARTNER, UserRole.MANAGER]
);



// Handle POST request for creating feedback
export async function GET(req: NextRequest, { params }: { params: any }) {
    const { id: shipmentId } = await params;

    return routeHandler.handle(req, { shipmentId });
}