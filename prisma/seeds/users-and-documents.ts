import "dotenv/config";

import {
  DocumentStatus,
  PrismaClient,
  Role,
} from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const password = "password123";
  const hash = await bcrypt.hash(password, 10);

  const documentTypesData = [
    "Community Engagement",
    "Revenue Collection and Real Property Tax",
    "Election Voting Management",
    "Barangay Management",
    "Disaster Response And Solid Waste",
    "Business Permit and Licensing",
    "Public Market and Vendor Management",
    "Office of the Senior Citizen Management",
    "Healthcare And Social Welfare",
  ];

  const documentTypes = [];

  for (const name of documentTypesData) {
    const type = await prisma.documentType.create({
      data: { name },
    });
    documentTypes.push(type);
  }

  const users = await Promise.all([
    prisma.user.create({
      data: {
        fullname: "Juan Dela Cruz",
        email: "juan@gmail.com",
        passwordHash: hash,
        role: Role.USER,
      },
    }),
    prisma.user.create({
      data: {
        fullname: "Maria Santos",
        email: "maria@gmail.com",
        passwordHash: hash,
        role: Role.USER,
      },
    }),
    prisma.user.create({
      data: {
        fullname: "Carlos Reyes",
        email: "carlos@gmail.com",
        passwordHash: hash,
        role: Role.USER,
      },
    }),
    prisma.user.create({
      data: {
        fullname: "Ana Villanueva",
        email: "ana@gmail.com",
        passwordHash: hash,
        role: Role.USER,
      },
    }),
    prisma.user.create({
      data: {
        fullname: "Pedro Garcia",
        email: "pedro@gmail.com",
        passwordHash: hash,
        role: Role.USER,
      },
    }),
  ]);

  const locations = [
    "Market Office Shelf A",
    "Election Box Shelf A",
    "Barangay Cabinet 1",
    "Revenue Office Drawer 2",
    "Health Office Shelf B",
    "Disaster Response Room 3",
  ];

  for (const docType of documentTypes) {
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(
      0,
      2 + Math.floor(Math.random() * 2),
    );

    for (const user of selectedUsers) {
      await prisma.document.create({
        data: {
          filePath: "/uploads/example.pdf",
          location: locations[Math.floor(Math.random() * locations.length)],
          status: DocumentStatus.ACTIVE,
          expirationDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ),
          owner: { connect: { id: user.id } },
          documentType: { connect: { id: docType.id } },
        },
      });
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
