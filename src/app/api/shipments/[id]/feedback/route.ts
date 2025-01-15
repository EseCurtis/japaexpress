/* eslint-disable @typescript-eslint/no-explicit-any */

import database from "@/app/config/database";
import { sendEmail } from "@/utils/email-service";
import { feedbackSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add route for creating feedback for shipment
routeHandler.addRoute(
    feedbackSchema,
    async (req: NextRequest, body, { shipmentId }, user) => {
        const { userId, email } = user!;
        const { rating, comments } = body;

        try {
            // Find the shipment by shipmentId
            const shipment = await database.shipments.findUnique({
                where: { uuid: shipmentId, customersEmail: email },
                include: {
                    manager: true,
                    customer: true,
                    assignedDeliveryPartner: true
                }
            });

            if (!shipment) {
                return { msg: "Shipment not found", status: 404 };
            }

            // Create feedback for the shipment
            const createdFeedback = await database.feedbacks.create({
                data: {
                    customersId: userId,
                    companyId: shipment.companyId,
                    comments,
                    rating,
                    shipmentId,  // Link feedback to specific shipment
                },
            });

            // Send email to customer
            await sendEmail({
                to: email,
                subject: "Feedback Received",
                text: `Thank you for your feedback on shipment ${shipmentId}.`,
                html: `<p>Thank you for your feedback on shipment <strong>${shipmentId}</strong>.</p>`,
            });

            // Send email to manager
            const managerEmail = shipment.manager?.email;
            await sendEmail({
                to: managerEmail!,
                subject: "New Feedback Received",
                text: `A new feedback has been received for shipment ${shipmentId}.`,
                html: `<p>A new feedback has been received for shipment <strong>${shipmentId}</strong>.</p>`,
            });

            // Send email to delivery partner
            const deliveryPartnerEmail = shipment.assignedDeliveryPartner?.email;
            await sendEmail({
                to: deliveryPartnerEmail!,
                subject: "New Feedback Received",
                text: `A new feedback has been received for shipment ${shipmentId}.`,
                html: `<p>A new feedback has been received for shipment <strong>${shipmentId}</strong>.</p>`,
            });

            return {
                msg: "Feedback created successfully",
                feedback: createdFeedback,
            };

        } catch (error) {
            console.error("Error creating feedback:", error);
            return { msg: "Internal server error", status: 500 };
        }
    },
    "POST",
    [UserRole.CUSTOMER]
);



// Handle POST request for creating feedback
export async function POST(req: NextRequest, { params }: { params: any }) {
    const { id: shipmentId } = await params;

    return routeHandler.handle(req, { shipmentId });
}