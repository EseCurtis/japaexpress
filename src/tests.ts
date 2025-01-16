
import { faker } from "@faker-js/faker";
import { ShipmentStatus } from "@prisma/client";

export function generateShipmentRecords(n: number) {
  const records = [];

  for (let i = 0; i < n; i++) {
    const randomStatus = Object.values(ShipmentStatus);
    const record = {
      description: faker.commerce.productDescription(),
      pickupAddress: faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.country(),
      deliveryAddress: faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.country(),
      status: randomStatus[Math.floor(Math.random() * randomStatus.length)],
      driversEmail: faker.internet.email(),
      customersEmail: faker.internet.email(),
    };

    records.push(record);
  }

  return records;
}

