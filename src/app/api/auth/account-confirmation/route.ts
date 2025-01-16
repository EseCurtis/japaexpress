
import database from "@/config/database";
import { sendEmail } from "@/utils/email-service";
import { confirmAccountSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import { ConfirmationScope } from "@prisma/client";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add the route with validation and handler logic
routeHandler.addRoute(
    confirmAccountSchema,
    async (req: NextRequest, body, { }) => {
        try {
            const { otp, email } = body;

            // Check if the confirmation entry exists in the database
            const matchedConfirmation = await database.confirmations.findUnique({
                where: {
                    user: {
                        email: email
                    },
                    otp,
                    scope: ConfirmationScope.ACCOUNT
                },
            });

            if (!matchedConfirmation) {
                return {
                    msg: "Invalid OTP",
                    status: 401,
                };
            }

            // Check if the OTP is expired
            const currentTime = new Date();
            if (matchedConfirmation.expiresAt < currentTime) {
                return {
                    msg: "OTP has expired. Please request a new one.",
                    status: 400,
                };
            }

            // Mark the user's account as confirmed
            await database.users.update({
                where: { email: email },
                data: { isConfirmed: true },
            });


            await database.confirmations.delete({
                where: {
                    uuid: matchedConfirmation.uuid
                },
            });
            // Send a confirmation success email to the user
            await sendEmail({
                to: email,
                subject: "Account Confirmation Successful",
                text: `Your account has been successfully confirmed.`,
                html: `<p>Your account has been successfully confirmed.</p>`,
            });


            return {
                msg: "Account confirmation successful",
                data: {
                    user: {
                        isConfirmed: true,
                    },
                },
            };
        } catch (error) {
            console.error("Error confirming account:", error);
            return {
                msg: "Internal server error",
                status: 500,
            };
        }
    },
    "POST"
);

// Handle POST request for account confirmation
export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
