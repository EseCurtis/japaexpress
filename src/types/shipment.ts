import { ShipmentStatus } from "@prisma/client";

export type ShipmentType = {
    uuid: string;
    customersEmail: string;
    driversEmail: string;
    companyId: string;
    status: ShipmentStatus;
    createdAt: string;
    updatedAt: string;
    description: string;
    deliveryAddress: string;
    pickupAddress: string;
}

export type ShipmentLogType = {
    uuid: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
    status: ShipmentStatus;
    error: string;
    companyId: string;
    shipmentId: string;
    createdAt: Date;
    updatedAt: Date;
}