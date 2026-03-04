"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAction(documentId: string, url: string) {
  await prisma.document.update({
    where: { id: documentId },
    data: { isDeleted: true },
  });
  revalidatePath(url);
}
