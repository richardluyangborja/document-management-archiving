"use server";

import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { getIpAddress } from "@/lib/getIpAddress";

export async function createBackup(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!document || !document.filePath) {
    throw new Error("Document not found or missing file.");
  }

  const uploadsDir = path.join(process.cwd(), "public");
  const backupsDir = path.join(process.cwd(), "public/backups");

  await fs.mkdir(backupsDir, { recursive: true });

  const fileName = path.basename(document.filePath);
  const timestamp = Date.now();

  const sourcePath = path.join(uploadsDir, document.filePath);
  const backupFileName = `${timestamp}-v${document.version}-${fileName}`;
  const destinationPath = path.join(backupsDir, backupFileName);

  await fs.copyFile(sourcePath, destinationPath);

  const result = await prisma.document.update({
    where: { id: documentId },
    data: {
      backupPath: `/backups/${backupFileName}`,
    },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_BACKUP",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/retrieval/backup");

  return { success: true };
}
