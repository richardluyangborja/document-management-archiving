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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { editContactNumberAction } from "./actions";

export default function EditContactNumber() {
  const [state, action, pending] = useActionState(
    editContactNumberAction,
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
          <DialogTitle>Edit Contact Number</DialogTitle>
          <DialogDescription>
            This action will change your contact number in the record
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
          <Field data-invalid={state?.errors?.contactNumber ? true : false}>
            <FieldLabel htmlFor="input-field-contact-number">
              Contact Number
            </FieldLabel>
            <Input
              id="input-field-contact-number"
              type="text"
              name="contactNumber"
              placeholder="Enter new contact number"
              aria-invalid={state?.errors?.contactNumber ? true : false}
            />
            {state?.errors?.contactNumber && (
              <p>{state.errors.contactNumber}</p>
            )}
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
