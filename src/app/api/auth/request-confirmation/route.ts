import database from "@/config/database";
import { sendEmail } from "@/utils/email-service"; // Utility to send emails
import { requestConfirmationSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import crypto from "crypto";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add the route with validation and handler logic
routeHandler.addRoute(
    requestConfirmationSchema,
    async (req: NextRequest, body) => {
        try {
            const { email } = body;

            // Check if the user exists
            const user = await database.users.findUnique({
                where: { email },
            });

            if (!user) {
                return {
                    msg: "User not found",
                    status: 404,
                };
            }

            // Generate a new OTP and expiration time
            const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

            // Store the OTP in the database
            await database.confirmations.create({
                data: { user: { connect: { email } }, otp, expiresAt },
            });

            // Send the OTP to the user's email
            await sendEmail({
                to: email,
                subject: "Account Confirmation OTP",
                text: `Your OTP for account confirmation is: ${otp}. This OTP will expire in 10 minutes.`,
                html: `<p>Your OTP for account confirmation is: <strong>${otp}</strong>. This OTP will expire in 10 minutes.</p>`,
            });

            return {
                msg: "Confirmation OTP sent successfully. Please check your email.",
                status: 200,
            };
        } catch (error) {
            console.error("Error requesting account confirmation:", error);
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
