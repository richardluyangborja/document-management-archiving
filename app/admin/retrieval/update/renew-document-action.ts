"use server";

import { verifySession } from "@/lib/dal";
import { getIpAddress } from "@/lib/getIpAddress";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function renewDocumentAction(
  documentId: string,
  expirationDate: Date,
) {
  return await prisma.$transaction(async (tx) => {
    const oldDocument = await tx.document.findUnique({
      where: { id: documentId },
    });

    if (!oldDocument) {
      throw new Error("Document not found");
    }

    await tx.document.update({
      where: { id: documentId },
      data: {
        status: "ARCHIVED",
      },
    });

    const newDocument = await tx.document.create({
      data: {
        filePath: oldDocument.filePath,
        location: oldDocument.location,
        expirationDate: expirationDate,
        ownerId: oldDocument.ownerId,
        documentTypeId: oldDocument.documentTypeId,

        version: oldDocument.version + 1,

        renewedFromId: oldDocument.id,

        status: "ACTIVE",
      },
    });

    const { userId } = await verifySession();

    await prisma.auditLog.create({
      data: {
        action: "DOCUMENT_ARCHIVED",
        ipAddress: await getIpAddress(),
        documentId: oldDocument.id,
        userId,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "DOCUMENT_RENEWED",
        ipAddress: await getIpAddress(),
        documentId: oldDocument.id,
        userId,
      },
    });

    revalidatePath("/admin/retrieval/update");

    return newDocument;
  });
}
