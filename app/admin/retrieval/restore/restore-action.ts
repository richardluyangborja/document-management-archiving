"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function restoreAction(documentId: string) {
  await prisma.document.update({
    where: { id: documentId },
    data: {
      isDeleted: false,
    },
  });
  revalidatePath("/admin/retrieval/restore");
}
