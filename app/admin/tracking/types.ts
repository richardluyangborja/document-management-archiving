import * as z from "zod";

export const UpdateLocationZodSchema = z.object({
  location: z.string({ error: "Please enter a valid version." }),
});

export type FormState =
  | {
      errors?: {
        location?: string[];
      };
      message?: string;
    }
  | undefined;
