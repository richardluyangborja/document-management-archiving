"use server";

import {
  EditDocumentOwnerZodSchema,
  EditDocumentTypeZodSchema,
  EditVersionZodSchema,
  FormState,
} from "./types";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { getIpAddress } from "@/lib/getIpAddress";

export async function editVersionAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = EditVersionZodSchema.safeParse({
    version: formData.get("version"),
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
    data: { version: Number(validatedFields.data.version) },
    include: { documentType: true },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_MODIFIED",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/storage");
  return { message: `Version changed to ${result.version}` };
}

export async function editDocumentTypeAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = EditDocumentTypeZodSchema.safeParse({
    documentType: formData.get("documentType"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);
    return { errors: fieldErrors };
  }

  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return { message: "Invalid document ID." };
  }

  const documentType = await prisma.documentType.findFirst({
    where: { name: validatedFields.data.documentType },
  });

  if (!documentType) {
    return { message: "Document type not found." };
  }

  const result = await prisma.document.update({
    where: { id },
    data: {
      documentType: {
        connect: { id: documentType.id },
      },
    },
    include: { documentType: true },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_MODIFIED",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/storage");

  return {
    message: `Document type updated to ${result.documentType.name}`,
  };
}

export async function editDocumentOwnerAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = EditDocumentOwnerZodSchema.safeParse({
    documentId: formData.get("documentId"),
    ownerId: formData.get("ownerId"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);
    return { errors: fieldErrors };
  }

  const { documentId, ownerId } = validatedFields.data;

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  if (!document) return { message: "Document not fount." };

  if (document.status === "BORROWED") {
    return { message: "Cannot change owner while document is borrowed." };
  }

  const userExists = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { id: true },
  });

  if (!userExists) {
    return { message: "Selected user does not exist." };
  }

  const result = await prisma.document.update({
    where: { id: documentId },
    data: {
      owner: {
        connect: { id: ownerId },
      },
    },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_MODIFIED",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/storage");

  return {
    message: `Document owner updated successfully.`,
  };
}

export async function editExpirationDateAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const date = new Date(formData.get("expirationDate")!.toString());

  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    return { message: "Invalid document ID." };
  }

  const result = await prisma.document.update({
    where: { id: id as string },
    data: { expirationDate: date },
  });

  const { userId } = await verifySession();

  await prisma.auditLog.create({
    data: {
      action: "DOCUMENT_MODIFIED",
      ipAddress: await getIpAddress(),
      documentId: result.id,
      userId,
    },
  });

  revalidatePath("/admin/storage");
  return { message: `Expiration date changed.` };
}
