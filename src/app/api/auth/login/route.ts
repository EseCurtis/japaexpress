
import database from "@/app/config/database";
import { AuthUserType } from "@/types/base-types";
import { loginSchema } from "@/utils/request-schemas";
import RouteHandler from "@/utils/route-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const routeHandler = new RouteHandler();

// Add the route with validation and handler logic
routeHandler.addRoute(
    loginSchema,
    async (req: NextRequest, body) => {
        const { email, password } = body;

        // Check if the user exists in the database
        const matchedUser = await database.users.findUnique({
            where: {
                email
            }
        });

        // If the user doesn't exist, return an error
        if (!matchedUser) {
            return {
                msg: "Invalid credentials",
                status: 401
            };
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, matchedUser.passwordHash);

        if (!isPasswordCorrect) {
            return {
                msg: "Invalid credentials",
                status: 401
            };
        }

        const authUser: AuthUserType = {
            userId: matchedUser.uuid,
            email: matchedUser.email,
            role: matchedUser.role,
            companyId: matchedUser.companyId
        }

        // Generate a JWT token
        const token = jwt.sign(
            authUser,
            process.env.JWT_SECRET || "NO_JWT",
            { expiresIn: "24h" }
        );

        // Return a success response with the JWT token
        return {
            msg: "User logged in successfully",
            data: { token, user: authUser }
        };
    }
);

export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
