"use server";

import { verifySession } from "@/lib/dal";
import { getIpAddress } from "@/lib/getIpAddress";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAccountAction(targetUserId: string) {
  await prisma.user.delete({
    where: { id: targetUserId },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "ACCOUNT_DELETED",
      ipAddress: await getIpAddress(),
      userId,
    },
  });

  revalidatePath("/admin/users-management");
}
