import database from "@/app/config/database";
import { stripSensitiveProperties } from "@/utils/helpers";
import { NextRequest } from "next/server";
import { registerCompanySchema } from "../../../../utils/request-schemas";
import RouteHandler from "../../../../utils/route-handler";

const routeHandler = new RouteHandler();

routeHandler.addRoute(
    registerCompanySchema,
    async (req: NextRequest, body) => {
        const { email, name, address, phone } = body;

        try {
            // Check if the user exists by email
            const matchedUser = await database.users.findUnique({
                where: {
                    email
                }
            });

            if (!matchedUser) {
                return { msg: "User with this email does not exist", status: 400 };
            }

            // Check if a company with the same name already exists for this user
            const existingCompany = await database.companies.findFirst({
                where: {
                    name,
                    users: {
                        some: {
                            email
                        }
                    }
                }
            });

            if (existingCompany) {
                return { msg: "Company with this name already exists for the user. Please use a different name.", status: 400 };
            }

            // Create the new company and associate it with the user
            const createdCompany = await database.companies.create({
                data: {
                    name,
                    address,
                    phone,
                    users: {
                        connect: {
                            email
                        }
                    }
                }
            });

            return {
                msg: "Company created successfully",
                data: stripSensitiveProperties(createdCompany, ["id"])
            };

        } catch (error) {
            console.error("Error registering company:", error);
            return { msg: "Error creating company", status: 500 };
        }
    }
);

export async function POST(req: NextRequest) {
    return routeHandler.handle(req);
}
