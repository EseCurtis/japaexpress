/* eslint-disable @typescript-eslint/no-explicit-any */

import database from "@/app/config/database";
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