"use server";

// import { verifySession } from "@/lib/dal";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState, UpdateLocationZodSchema } from "./types";

export async function updateLocationAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = UpdateLocationZodSchema.safeParse({
    location: formData.get("location"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      errors: fieldErrors,
    };
  }

  // const { userId } = await verifySession();

  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return { message: "Invalid document ID." };
  }

  const result = await prisma.document.update({
    where: { id: id as string },
    data: { location: validatedFields.data.location },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document moved to ${result.location}` };
}

export async function archiveDocumentAction(docId: string): Promise<FormState> {
  // const { userId } = await verifySession();

  await prisma.document.update({
    where: { id: docId },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document archived.` };
}

export async function unarchiveDocumentAction(
  docId: string,
): Promise<FormState> {
  // const { userId } = await verifySession();

  await prisma.document.update({
    where: { id: docId },
    data: { status: "ACTIVE" },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document unarchived.` };
}

export async function borrowDocumentAction(
  docId: string,
  borrowerId: string,
): Promise<FormState> {
  // const { userId } = await verifySession();

  await prisma.borrowTransaction.create({
    data: {
      borrowerId,
      documentId: docId,
    },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document archived.` };
}

export async function returnDocumentAction(
  transactionId: string,
): Promise<FormState> {
  // const { userId } = await verifySession();

  await prisma.borrowTransaction.update({
    where: { id: transactionId },
    data: { status: "RETURNED" },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document unarchived.` };
}
