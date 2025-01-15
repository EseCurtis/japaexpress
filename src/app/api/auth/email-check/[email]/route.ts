/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/app/config/database";
import RouteHandler from "@/utils/route-handler";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

// Add route with validation and handler logic
routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, { email }) => {
        try {
            // Check if the user already exists by email
            const existingUser = await database.users.findUnique({
                where: {
                    email,
                },
            });

            return {
                msg: "Email check success",
                data: {
                    available: !Boolean(existingUser)
                },
            };
        } catch (error) {
            console.error("Error registering user:", error);
            return { msg: "Error registering user", status: 500 };
        }
    },
    "GET"
);

export async function GET(req: NextRequest, { params }: any) {
    const { email } = await params;
    return routeHandler.handle(req, { email });
}
