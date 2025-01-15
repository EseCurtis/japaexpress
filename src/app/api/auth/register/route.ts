import database from "@/app/config/database";
import { stripSensitiveProperties } from "@/utils/helpers";
import { registerUserSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add route with validation and handler logic
routeHandler.addRoute(
    registerUserSchema,
    async (req: NextRequest, body) => {
        try {
            const { password, firstName, lastName, role, email } = body;

            // Check if the user already exists by email
            const existingUser = await database.users.findUnique({
                where: {
                    email,
                },
            });

            if (existingUser) {
                return { msg: "User with this email already exists", status: 400 };
            }

            // Hash the password before storing
            const passwordHash = await bcrypt.hash(password, 10);

            // Create the new user
            const createdUser = await database.users.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    role,
                    passwordHash,
                },
            });

            return {
                msg: "User registered successfully",
                data: stripSensitiveProperties(createdUser, ["id"]),
            };
        } catch (error) {
            console.error("Error registering user:", error);
            return { msg: "Error registering user", status: 500 };
        }
    }
);

export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
