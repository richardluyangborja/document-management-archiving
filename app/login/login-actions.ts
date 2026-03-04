"use server";

import prisma from "@/lib/prisma";
import { FormState, LoginFormZodSchema } from "./login-types";
import * as z from "zod";
import * as bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = LoginFormZodSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const { fieldErrors } = z.flattenError(validatedFields.error);

    return {
      errors: fieldErrors,
    };
  }

  const foundUser = await prisma.user.findFirst({
    where: { email: validatedFields.data.email },
  });
  if (!foundUser) return { message: "Email or password is incorrect." };

  const isPasswordMatch = await bcrypt.compare(
    validatedFields.data.password,
    foundUser.passwordHash,
  );
  if (!isPasswordMatch) return { message: "Email or password is incorrect." };

  await createSession(foundUser.id, foundUser.role);

  if (foundUser.role === "ADMIN") redirect("/admin/storage");
  if (foundUser.role === "USER") redirect("/profile");
}
