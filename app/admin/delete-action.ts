"use server";

import { verifySession } from "@/lib/dal";
import { getIpAddress } from "@/lib/getIpAddress";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAction(documentId: string, url: string) {
  const result = await prisma.document.update({
    where: { id: documentId },
    data: { isDeleted: true },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_DELETED",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath(url);
}
