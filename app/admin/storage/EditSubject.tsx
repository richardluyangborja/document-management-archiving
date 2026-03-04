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
import { use, useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editDocumentOwnerAction } from "./actions";

type UserOption = {
  id: string;
  fullname: string;
  email: string;
};

export default function EditDocumentOwner({
  id,
  users,
}: {
  id: string;
  users: Promise<UserOption[]>;
}) {
  const u = use(users);

  const [state, action, pending] = useActionState(
    editDocumentOwnerAction,
    undefined,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit subject
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Document Subject</DialogTitle>
          <DialogDescription>
            This action will change the document&apos;s subject/owner.
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
          <input name="documentId" value={id} readOnly hidden />

          <Field data-invalid={!!state?.errors?.ownerId}>
            <FieldLabel>New Owner</FieldLabel>

            <Select name="ownerId">
              <SelectTrigger aria-invalid={!!state?.errors?.ownerId}>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {u.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullname} ({user.email})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {state?.errors?.ownerId && (
              <p className="text-sm text-destructive">{state.errors.ownerId}</p>
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
