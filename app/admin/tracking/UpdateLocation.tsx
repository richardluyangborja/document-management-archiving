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
import { updateLocationAction } from "./actions";

export default function UpdateLocation({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    updateLocationAction,
    undefined,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Update location
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Document Location</DialogTitle>
          <DialogDescription>
            This action will change the location where the document is currently
            stored.
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
          <Field data-invalid={state?.errors?.location ? true : false}>
            <FieldLabel htmlFor="input-field-location">Location</FieldLabel>
            <Input
              id="input-field-location"
              type="text"
              name="location"
              placeholder="Enter location"
              aria-invalid={state?.errors?.location ? true : false}
            />
            {state?.errors?.location && <p>{state.errors.location}</p>}
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
