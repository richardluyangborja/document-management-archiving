"use client";

import { Button } from "@/components/ui/button";
import { InfoIcon, Pencil } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { editBirthDateAction } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export default function EditBirthDate() {
  const [state, action, pending] = useActionState(
    editBirthDateAction,
    undefined,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Birthday</DialogTitle>
          <DialogDescription>
            Enter your birthday (e.g. August 22 2005)
          </DialogDescription>
        </DialogHeader>

        {state?.message && (
          <Alert>
            <InfoIcon />
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <form action={action}>
          <Field data-invalid={state?.errors?.birthDate ? true : false}>
            <FieldLabel htmlFor="input-field-birthDate">Birthday</FieldLabel>
            <Input
              id="input-field-birthDate"
              type="text"
              name="birthDate"
              placeholder="August 22 2005"
              aria-invalid={state?.errors?.birthDate ? true : false}
            />
            {state?.errors?.birthDate && <p>{state.errors.birthDate}</p>}
          </Field>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            {pending ? (
              <Button disabled>
                Loading
                <Spinner data-icon="inline-start" />
              </Button>
            ) : (
              <Button type="submit" disabled={pending}>
                Submit
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
