/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/config/database";
import { sendEmail } from "@/utils/email-service";
import { updateShipmentSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    updateShipmentSchema,
    async (req: NextRequest, body, { shipmentId }, authUser) => {
        const { companyId } = authUser!

        // Extract the update data from the request body
        const {
            pickupAddress,
            deliveryAddress,
            description,
            customerEmail,
            driverEmail,
            status
        } = body;

        try {
            // Check if the shipment exists
            const shipment = await database.shipments.findUnique({
                where: { uuid: shipmentId, companyId: companyId! },
            });

            if (!shipment) {
                return { msg: "Shipment not found", status: 404 };
            }


            // Update the shipment
            const updatedShipment = await database.shipments.update({
                where: { uuid: shipmentId },
                data: {
                    pickupAddress: pickupAddress || shipment.pickupAddress,
                    deliveryAddress: deliveryAddress || shipment.deliveryAddress,
                    description: description || shipment.description,
                    customersEmail: customerEmail,
                    driversEmail: driverEmail,
                    status: status || shipment.status
                }
            });

            // Notify the stakeholders of the change
            await sendEmail({
                to: shipment.customersEmail!,
                subject: "Shipment Status Update",
                text: `The shipment status has been updated to: ${status}.`,
                html: `<p>The shipment status has been updated to: <strong>${status}</strong>.</p>`,
            });

            await sendEmail({
                to: shipment.driversEmail!,
                subject: "Shipment Status Update",
                text: `The shipment status has been updated to: ${status}.`,
                html: `<p>The shipment status has been updated to: <strong>${status}</strong>.</p>`,
            });

            return {
                msg: "Shipment updated successfully",
                data: updatedShipment,
            };
        } catch (error) {
            console.error("Error updating shipment:", error);
            return { msg: "Error updating shipment", status: 500 };
        }
    },
    "PUT",
    [UserRole.MANAGER]
);

export async function PUT(req: NextRequest, { params }: { params: any }) {
    const { id: shipmentId } = await params;
    return routeHandler.handle(req, { shipmentId });
}
