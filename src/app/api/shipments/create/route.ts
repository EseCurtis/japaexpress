import database from "@/app/config/database";
import { sendEmail } from "@/utils/email-service";
import { stripSensitiveProperties } from "@/utils/helpers";
import { createShipmentSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    createShipmentSchema,
    async (req: NextRequest, body, { }, authUser) => {
        const { userId } = authUser!;

        const { pickupAddress, deliveryAddress, description, customerId, assignedDeliveryPartnerId, companyId } = body;

        try {
            console.log("Received request body:", body);

            // Check if the customer exists
            const customer = await database.users.findUnique({
                where: {
                    uuid: customerId,
                    role: UserRole.CUSTOMER,
                },
            });

            if (!customer) {
                console.log("Customer with this email not found");
                return { msg: "Customer with this email not found", status: 404 };
            }

            // Check if the assigned delivery partner exists
            let assignedDeliveryPartner = null;
            if (assignedDeliveryPartnerId) {
                assignedDeliveryPartner = await database.users.findUnique({
                    where: {
                        uuid: assignedDeliveryPartnerId,
                        role: UserRole.DELIVERY_PARTNER,
                    },
                });

                if (!assignedDeliveryPartner) {
                    console.log("Assigned delivery partner not found");
                    return { msg: "Assigned delivery partner not found", status: 404 };
                }
            }

            // Check if the company exists
            const company = await database.companies.findUnique({
                where: {
                    uuid: companyId,
                },
            });

            if (!company) {
                console.log("Company not found");
                return { msg: "Company not found", status: 404 };
            }

            const createdShipment = await database.shipments.create({
                data: {
                    pickupAddress,
                    deliveryAddress,
                    description,
                    customersEmail: customer.email,
                    status: "PENDING", // Default status
                    assignedDeliveryPartnerId: assignedDeliveryPartner ? assignedDeliveryPartner.uuid : null,
                    managerId: userId,
                    companyId,
                }
            });

            // Send email to delivery partner
            if (assignedDeliveryPartner) {
                await sendEmail({
                    to: assignedDeliveryPartner.email,
                    subject: "New Shipment Assigned",
                    text: `A new shipment has been assigned to you. Shipment ID: ${createdShipment.uuid}.`,
                    html: `<p>A new shipment has been assigned to you. Shipment ID: <strong>${createdShipment.uuid}</strong>.</p>`,
                });
            }

            // Send email to customer
            await sendEmail({
                to: customer.email,
                subject: "Shipment Created",
                text: `Your shipment has been created successfully. Shipment ID: ${createdShipment.uuid}.`,
                html: `<p>Your shipment has been created successfully. Shipment ID: <strong>${createdShipment.uuid}</strong>.</p>`,
            });


            return {
                msg: "Shipment created successfully",
                data: stripSensitiveProperties(createdShipment, ["id"])
            };

        } catch (error) {
            console.error("Error creating shipment:", error);
            return { msg: "Error creating shipment", status: 500 };
        }
    },
    "POST",
    [UserRole.MANAGER]
);

export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
