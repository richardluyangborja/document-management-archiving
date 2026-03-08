"use server";

// import { verifySession } from "@/lib/dal";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FormState, UpdateLocationZodSchema } from "./types";
import { getIpAddress } from "@/lib/getIpAddress";
import { verifySession } from "@/lib/dal";

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

  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return { message: "Invalid document ID." };
  }

  const result = await prisma.document.update({
    where: { id: id as string },
    data: { location: validatedFields.data.location },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_LOCATION_CHANGE",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document moved to ${result.location}` };
}

export async function archiveDocumentAction(docId: string): Promise<FormState> {
  const result = await prisma.document.update({
    where: { id: docId },
    data: { status: "ARCHIVED" },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_ARCHIVED",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document archived.` };
}

export async function unarchiveDocumentAction(
  docId: string,
): Promise<FormState> {
  const result = await prisma.document.update({
    where: { id: docId },
    data: { status: "ACTIVE" },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_UNARCHIVED",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document unarchived.` };
}

export async function borrowDocumentAction(
  transactionId: string,
): Promise<FormState> {
  const result = await prisma.borrowTransaction.update({
    where: { id: transactionId },
    data: {
      status: "ACTIVE",
    },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_BORROWED",
      ipAddress: await getIpAddress(),
      documentId: result.documentId,
      userId,
    },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document borrowed.` };
}

export async function returnDocumentAction(
  transactionId: string,
): Promise<FormState> {
  // const { userId } = await verifySession();

  const result = await prisma.borrowTransaction.delete({
    where: { id: transactionId },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_RETURNED",
      ipAddress: await getIpAddress(),
      documentId: result.documentId,
      userId,
    },
  });

  revalidatePath("/admin/tracking");
  return { message: `Document returned.` };
}

export async function refuseBorrowAction(transactionId: string) {
  const result = await prisma.borrowTransaction.delete({
    where: { id: transactionId },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_REFUSED",
      ipAddress: await getIpAddress(),
      documentId: result.documentId,
      userId,
    },
  });

  revalidatePath("/admin/tracking");
}
