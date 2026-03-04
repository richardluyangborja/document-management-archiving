import "dotenv/config";

import { Prisma, PrismaClient, Role } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

export async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const password = "password123";
  const hash = await bcrypt.hash(password, 10);

  const users: Prisma.UserCreateInput[] = [
    {
      email: "alhea@gmail.com",
      passwordHash: hash,
      fullname: "Alhea Sarona",
      role: Role.ADMIN,
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log("User seed complete.");
}

main().catch(() => console.error("User seed failed."));
