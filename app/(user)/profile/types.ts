import * as z from "zod";

export const EditAddressZodSchema = z.object({
  address: z.string().min(2, { error: "Please enter a valid address." }).trim(),
});

export const EditContactNumberZodSchema = z.object({
  contactNumber: z
    .string()
    .min(2, { error: "Please enter a valid number." })
    .trim(),
});

export const EditFullnameZodSchema = z.object({
  firstname: z
    .string()
    .min(2, { error: "Please enter a valid first name." })
    .trim(),
  lastname: z
    .string()
    .min(2, { error: "Please enter a valid last name." })
    .trim(),
});

function parseDateString(value: unknown): Date | undefined {
  if (typeof value !== "string") return undefined;

  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) return undefined;

  return parsed;
}

export const EditBirthDateZodSchema = z.object({
  birthDate: z.preprocess(
    (val) => parseDateString(val),
    z
      .date({ message: "Please enter a valid birth date." })
      .refine((date) => date < new Date(), {
        message: "Birthdate cannot be in the future.",
      }),
  ),
});

export type FormState =
  | {
      errors?: {
        address?: string[];
        firstname?: string[];
        lastname?: string[];
        birthDate?: string[];
        contactNumber?: string[];
      };
      message?: string;
    }
  | undefined;
