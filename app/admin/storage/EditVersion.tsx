"use client";

import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { editVersionAction } from "./actions";

export default function EditVersion({ id }: { id: string }) {
  const [state, action, pending] = useActionState(editVersionAction, undefined);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit version
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Version</DialogTitle>
          <DialogDescription>
            This action will change the version of the document in the record
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
          <input name="id" value={id} readOnly hidden />
          <Field data-invalid={state?.errors?.version ? true : false}>
            <FieldLabel htmlFor="input-field-version">Version</FieldLabel>
            <Input
              id="input-field-version"
              type="text"
              name="version"
              placeholder="Enter version"
              aria-invalid={state?.errors?.version ? true : false}
            />
            {state?.errors?.version && <p>{state.errors.version}</p>}
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
