"use server";

import { verifySession } from "@/lib/dal";
import {
  EditAddressZodSchema,
  EditBirthDateZodSchema,
  EditContactNumberZodSchema,
  EditFullnameZodSchema,
  FormState,
} from "./types";
import * as z from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getIpAddress } from "@/lib/getIpAddress";

export async function editAddressAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = EditAddressZodSchema.safeParse({
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      errors: fieldErrors,
    };
  }

  const { userId } = await verifySession();

  const result = await prisma.user.update({
    where: { id: userId },
    data: { address: validatedFields.data.address },
  });

  await prisma.auditLog.create({
    data: {
      action: "ACCOUNT_MODIFIED",
      ipAddress: await getIpAddress(),
      userId,
    },
  });

  revalidatePath("/profile");
  return { message: `Address changed to ${result.address}` };
}

export async function editContactNumberAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = EditContactNumberZodSchema.safeParse({
    contactNumber: formData.get("contactNumber"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      errors: fieldErrors,
    };
  }

  const { userId } = await verifySession();

  const result = await prisma.user.update({
    where: { id: userId },
    data: { contactNumber: validatedFields.data.contactNumber },
  });

  await prisma.auditLog.create({
    data: {
      action: "ACCOUNT_MODIFIED",
      ipAddress: await getIpAddress(),
      userId,
    },
  });

  revalidatePath("/profile");
  return { message: `Contact number changed to ${result.contactNumber}` };
}

export async function editFullnameAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = EditFullnameZodSchema.safeParse({
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      errors: fieldErrors,
    };
  }

  const { userId } = await verifySession();

  const fullname = `${validatedFields.data.firstname} ${validatedFields.data.lastname}`;

  const result = await prisma.user.update({
    where: { id: userId },
    data: { fullname },
  });

  await prisma.auditLog.create({
    data: {
      action: "ACCOUNT_MODIFIED",
      ipAddress: await getIpAddress(),
      userId,
    },
  });

  revalidatePath("/profile");
  return { message: `Name changed to ${result.fullname}` };
}

export async function editBirthDateAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = EditBirthDateZodSchema.safeParse({
    birthDate: formData.get("birthDate"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      errors: fieldErrors,
    };
  }

  const { userId } = await verifySession();

  await prisma.user.update({
    where: { id: userId },
    data: { birthDate: validatedFields.data.birthDate },
  });

  await prisma.auditLog.create({
    data: {
      action: "ACCOUNT_MODIFIED",
      ipAddress: await getIpAddress(),
      userId,
    },
  });

  revalidatePath("/profile");

  return {
    message: `Birthdate changed to ${formData.get("birthDate")}`,
  };
}
