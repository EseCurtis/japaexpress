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

        const { pickupAddress, deliveryAddress, description, customerEmail, driverEmail, companyId } = body;

        try {
           
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
                    customersEmail: customerEmail,
                    status: "PENDING", // Default status
                    driversEmail: driverEmail,
                    managerId: userId,
                    companyId,
                }
            });

            // Send email to delivery partner
            if (driverEmail) {
                await sendEmail({
                    to: driverEmail,
                    subject: "New Shipment Assigned",
                    text: `A new shipment has been assigned to you. Shipment ID: ${createdShipment.uuid}.`,
                    html: `<p>A new shipment has been assigned to you. Shipment ID: <strong>${createdShipment.uuid}</strong>.</p>`,
                });
            }

            // Send email to customer
            await sendEmail({
                to: customerEmail,
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
    [UserRole.MANAGER, UserRole.CUSTOMER]
);

export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
