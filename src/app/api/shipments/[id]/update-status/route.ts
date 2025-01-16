/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/config/database";
import { sendEmail } from "@/utils/email-service";
import { updateShipmentStatusSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    updateShipmentStatusSchema,
    async (req: NextRequest, body, { shipmentId }, authUser) => {
        // Extract the update data from the request body

        const { companyId } = authUser!;

        const {
            status
        } = body;

        try {

            // Check if the shipment exists
            const shipment = await database.shipments.findUnique({
                where: { uuid: shipmentId, companyId: companyId! },
                include: {
                    manager: true
                }
            });

            if (!shipment) {
                return { msg: "Shipment not found", status: 404 };
            }




            // Update the shipment
            const updatedShipment = await database.shipments.update({
                where: { uuid: shipmentId },
                data: {
                    status: status || shipment.status
                }
            });

            // Notify the customer and manager of the update
            const customerEmail = shipment.customersEmail;
            const managerEmail = shipment.manager?.email;

            const emailPromises = [];

            if (customerEmail) {
                emailPromises.push(
                    sendEmail({
                        to: customerEmail,
                        subject: "Shipment Status Update",
                        text: `Your shipment status has been updated to: ${status}.`,
                        html: `<p>Your shipment status has been updated to: <strong>${status}</strong>.</p>`,
                    })
                );
            }

            if (managerEmail) {
                emailPromises.push(
                    sendEmail({
                        to: managerEmail,
                        subject: "Shipment Status Update",
                        text: `The shipment status has been updated to: ${status}.`,
                        html: `<p>The shipment status has been updated to: <strong>${status}</strong>.</p>`,
                    })
                );
            }

            await Promise.all(emailPromises);

            return {
                msg: "Shipment status updated successfully",
                data: updatedShipment,
            };
        } catch (error) {
            console.error("Error updating shipment status:", error);
            return { msg: "Error updating shipment status", status: 500 };
        }
    },
    "PUT",
    [UserRole.MANAGER, UserRole.DELIVERY_PARTNER]
);

export async function PUT(req: NextRequest, { params }: { params: any }) {
    const { id: shipmentId } = await params;
    return routeHandler.handle(req, { shipmentId });
}
