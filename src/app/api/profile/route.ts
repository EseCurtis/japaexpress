 
import database from "@/app/config/database";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

// Add route for retrieving user bio data
routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, {}, authUser) => {
        try {
            const { userId } = authUser!;

            // Validate and fetch user data
            const matchedUser = await database.users.findUnique({
                where: { uuid: userId },
            });

            if (!matchedUser) {
                return {
                    msg: "User not found",
                    status: 404,
                };
            }

            // Strip sensitive data if needed
            const sanitizedUser = {
                uuid: matchedUser.uuid,
                firstName: matchedUser.firstName,
                lastName: matchedUser.lastName,
                email: matchedUser.email,
                role: matchedUser.role,
                createdAt: matchedUser.createdAt,
                updatedAt: matchedUser.updatedAt,
            };

            return {
                msg: "User bio data retrieved successfully",
                data: sanitizedUser,
            };
        } catch (error) {
            console.error("Error retrieving bio data:", error);
            return {
                msg: "Internal server error",
                status: 500,
            };
        }
    },
    "GET",
    [UserRole.CUSTOMER, UserRole.DELIVERY_PARTNER, UserRole.MANAGER] // Role-based access control
);

// Handle GET request for retrieving user bio data
export async function GET(req: NextRequest) {
    return routeHandler.handle(req);
}
