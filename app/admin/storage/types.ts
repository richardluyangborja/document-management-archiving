import * as z from "zod";

export const EditVersionZodSchema = z.object({
  version: z.string({ error: "Please enter a valid version." }),
});

export const EditDocumentTypeZodSchema = z.object({
  documentType: z.string({ error: "Please enter a valid version." }),
});

export const EditContactNumberZodSchema = z.object({
  contactNumber: z
    .string()
    .min(2, { error: "Please enter a valid number." })
    .trim(),
});

export const EditDocumentOwnerZodSchema = z.object({
  documentId: z.string(),
  ownerId: z.string(),
});

export type FormState =
  | {
      errors?: {
        version?: string[];
        documentType?: string[];
        documentId?: string[];
        ownerId?: string[];
        contactNumber?: string[];
        expirationDate?: string[];
      };
      message?: string;
    }
  | undefined;
