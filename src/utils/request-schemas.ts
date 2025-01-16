import { ShipmentStatus, UserRole } from "@prisma/client";
import { z } from "zod";

// Authentication & User Management

//user register schema
export const registerUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password should have at least 8 characters"),
    //role: z.enum(Object.values(UserRole) as [UserRole])
});

// company register schema
export const registerCompanySchema = z.object({
    name: z.string().min(1, "Company name is required"),
    address: z.string().min(1, "Company Address is required"),
    phone: z.string().min(1, "Company phone is required"),
});

// Login schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password should have at least 8 characters"),
});

// request confirmation schema
export const requestConfirmationSchema = z.object({
    email: z.string().email("Invalid email format"),
});

// Confirm account schema
export const confirmAccountSchema = z.object({
    email: z.string().email("Invalid email format"),
    otp: z.number().min(8, "Password should have at least 8 characters"),
});

// Role assignment schema
export const assignRoleSchema = z.object({
    userId: z.string().uuid("Invalid user ID format"),
    role: z.enum(Object.values(UserRole) as [UserRole])
});

// Shipment Management

// Create shipment schema
export const createShipmentSchema = z.object({
    pickupAddress: z.string().min(1, "Pickup address is required"),
    deliveryAddress: z.string().min(1, "Delivery address is required"),
    customerEmail: z.string().email("Invalid customer ID format"),
    description: z.string().min(10, "Description length must be greater than 10 characters "),
    driverEmail: z.string().email("Invalid customer ID format"),
    companyId: z.string().uuid("Invalid company ID format"),
});

// Update shipment schema
export const updateShipmentSchema = z.object({
    pickupAddress: z.string().optional(),
    deliveryAddress: z.string().optional(),
    customerEmail: z.string().email("Invalid customer ID format").optional(),
    description: z.string().min(10, "Description length must be greater than 10 characters ").optional(),
    driverEmail:  z.string().email("Invalid customer ID format").optional(),
    status: z.enum(Object.values(ShipmentStatus) as [ShipmentStatus]).optional()
});


// Update user schema
export const updateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "First name is required").optional(),
    role: z.enum(Object.values(UserRole) as [UserRole]).optional()
});

// Update user schema
export const updateProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
});

// Update shipment status schema
export const updateShipmentStatusSchema = z.object({
    status: z.enum(Object.values(ShipmentStatus) as [ShipmentStatus]).optional()
});

// Location update schema (Driver)
export const locationUpdateSchema = z.object({
    latitude: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
    longitude: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
    timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid timestamp format"),
    status: z.enum(Object.values(ShipmentStatus) as [ShipmentStatus]),
    error: z.string().min(1, "Error length must be greater than 1 character ").optional(),
});

// Feedback schema (Customer)
export const feedbackSchema = z.object({
    rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
    comments: z.string().optional(),
});

// Proof of delivery schema
export const proofOfDeliverySchema = z.object({
    proofType: z.enum(["photo", "signature"]),
    file: z.string().min(1, "File is required"),
});


export const basePaginationSchema = z.object({
    page: z.number().min(1, "page is required").default(1), // Page number (defaults to 1)
    limit: z.number().min(1, "limit is required").max(100).default(10), // Limit number of items per page (defaults to 10)
})

export const userListSchema = z.object({
    role: z.enum(Object.values(UserRole) as [UserRole])
})

export const emailCheckSchema = z.object({
    email: z.string().email("Invalid email format"),
})