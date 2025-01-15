/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/app/config/database";
import { updateShipmentSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import { UserRole, Users } from "@prisma/client";
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
            customerId,
            assignedDeliveryPartnerId,
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

            let customer: Users | null = null

            if (customerId) {
                customer = await database.users.findUnique({
                    where: {
                        uuid: customerId,
                        role: UserRole.CUSTOMER
                    },
                });

                if (!customer) {
                    return { msg: "Customer not found", status: 404 };
                }
            }


            // Update the shipment
            const updatedShipment = await database.shipments.update({
                where: { uuid: shipmentId },
                data: {
                    pickupAddress: pickupAddress || shipment.pickupAddress,
                    deliveryAddress: deliveryAddress || shipment.deliveryAddress,
                    description: description || shipment.description,
                    customersEmail: customer ? customer.email : shipment.customersEmail,
                    assignedDeliveryPartnerId: assignedDeliveryPartnerId || shipment.assignedDeliveryPartnerId,
                    status: status || shipment.status
                }
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
