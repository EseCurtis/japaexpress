/* eslint-disable @typescript-eslint/no-explicit-any */
import database from "@/app/config/database";
import { stripSensitiveProperties } from "@/utils/helpers";
import RouteHandler from "@/utils/route-handler";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { z } from "zod";

const routeHandler = new RouteHandler();

// Add route for retrieving all shipments with number-based pagination and filters
routeHandler.addRoute(
    z.object({}),
    async (req: NextRequest, body, {}, authUser) => {
        try {
            const { companyId } = authUser!;

            const searchParams = req.nextUrl.searchParams;
            const page = Number(searchParams.get("page")) || 1; // Current page number
            const limit = Number(searchParams.get("limit")) || 10; // Items per page
            const offset = (page - 1) * limit;

            // Filters
            const statuses = searchParams.get("status")?.split(",") || []; // Comma-separated statuses
            const driversEmail = searchParams.get("driversEmail") || undefined;
            const customersEmail = searchParams.get("customersEmail") || undefined;
            const search = searchParams.get("search") || ""; // Search query

            // Build the `where` condition for Prisma
            const where: any = {
                companyId: companyId!, // Filter by company ID
                ...(statuses.length > 0 && { status: { in: statuses } }), // Filter by statuses
                ...(driversEmail && { driversEmail: driversEmail }), // Filter by delivery partner
                ...(customersEmail && { customersEmail }), // Filter by customer ID
                ...(search && {
                    OR: [
                        { description: { contains: search, mode: "insensitive" } }, // Match description
                        { pickupAddress: { contains: search, mode: "insensitive" } }, // Match pickup address
                        { deliveryAddress: { contains: search, mode: "insensitive" } }, // Match delivery address
                    ],
                }),
            };

            // Fetch the filtered shipments
            const shipments = await database.shipments.findMany({
                skip: offset,
                take: limit,
                orderBy: { createdAt: "desc" }, // Sort by creation date
                where,
            });

            // Count total shipments for pagination metadata
            const totalShipments = await database.shipments.count({ where });

            // Calculate total pages
            const totalPages = Math.ceil(totalShipments / limit);

            return {
                msg: "Shipments retrieved successfully",
                data: shipments.map((shipment) =>
                    stripSensitiveProperties(shipment, ["id"]) // Strip sensitive properties
                ),
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalShipments,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            };
        } catch (error) {
            console.error("Error retrieving shipments:", error);
            return { msg: "Internal server error", status: 500 };
        }
    },
    "GET",
    [UserRole.CUSTOMER, UserRole.DELIVERY_PARTNER, UserRole.MANAGER] // Role-based access
);

// Handle GET request for retrieving all shipments (number-based pagination with filters)
export async function GET(req: NextRequest) {
    return routeHandler.handle(req);
}
