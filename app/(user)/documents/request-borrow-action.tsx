"use server";

import { verifySession } from "@/lib/dal";
import { getIpAddress } from "@/lib/getIpAddress";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestBorrowAction(docId: string, borrowerId: string) {
  const result = await prisma.borrowTransaction.create({
    data: { documentId: docId, borrowerId: borrowerId, status: "PENDING" },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_REQUESTED",
      ipAddress: await getIpAddress(),
      documentId: result.documentId,
      userId,
    },
  });

  revalidatePath("/documents");
}
