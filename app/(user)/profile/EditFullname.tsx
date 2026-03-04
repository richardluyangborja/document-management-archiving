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
import { editFullnameAction } from "./actions";

export default function EditFullname() {
  const [state, action, pending] = useActionState(
    editFullnameAction,
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
          <DialogTitle>Edit Name</DialogTitle>
          <DialogDescription>
            This action will change your name in the record
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
          <Field data-invalid={state?.errors?.address ? true : false}>
            <FieldLabel htmlFor="input-field-firstname">First name</FieldLabel>
            <Input
              id="input-field-firstname"
              type="text"
              name="firstname"
              aria-invalid={state?.errors?.address ? true : false}
            />
            {state?.errors?.address && <p>{state.errors.address}</p>}
          </Field>
          <Field data-invalid={state?.errors?.address ? true : false}>
            <FieldLabel htmlFor="input-field-lastname">Last name</FieldLabel>
            <Input
              id="input-field-lastname"
              type="text"
              name="lastname"
              aria-invalid={state?.errors?.address ? true : false}
            />
            {state?.errors?.address && <p>{state.errors.address}</p>}
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
