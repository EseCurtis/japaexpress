/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/app/config/database";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, { shipmentId }, authUser) => {
        try {
            const { companyId } = authUser!;
            // Example: Find shipment by shipmentId
            const shipment = await database.shipments.findUnique({
                where: { uuid: shipmentId, companyId: companyId! },
            });

            if (!shipment) {
                return new Response("Shipment not found", { status: 404 });
            }

            // Example: Proceed with deletion
            await database.shipments.delete({
                where: { uuid: shipmentId },
            });

            return new Response("Shipment deleted successfully", { status: 200 });
        } catch (error) {
            console.error("Error deleting shipment:", error);
            return new Response("Internal server error", { status: 500 });
        }
    },
    "DELETE",
    [UserRole.MANAGER]
);

export async function DELETE(req: NextRequest, { params }: { params: any }) {
    const { id: shipmentId } = await params;

    return routeHandler.handle(req, { shipmentId });
}
