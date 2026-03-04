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
import { useActionState } from "react";
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
import { editDocumentTypeAction } from "./actions";

export default function EditDocumentType({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    editDocumentTypeAction,
    undefined,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit Document Type
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Document Type</DialogTitle>
          <DialogDescription>
            This action will change the type of the document in the record
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
          <Field data-invalid={state?.errors?.documentType ? true : false}>
            <FieldLabel htmlFor="input-field-document-type">
              Document Type
            </FieldLabel>
            <Select
              name="documentType"
              aria-invalid={state?.errors?.documentType ? true : false}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Community Engagement">
                    Community Engagement
                  </SelectItem>
                  <SelectItem value="Revenue Collection and Real Property Tax">
                    Revenue Collection and Real Property Tax
                  </SelectItem>
                  <SelectItem value="Election Voting Management">
                    Election Voting Management
                  </SelectItem>
                  <SelectItem value="Barangay Management">
                    Barangay Management
                  </SelectItem>
                  <SelectItem value="Disaster Response And Solid Waste">
                    Disaster Response And Solid Waste
                  </SelectItem>
                  <SelectItem value="Business Permit and Licensing">
                    Business Permit and Licensing
                  </SelectItem>
                  <SelectItem value="Public Market and Vendor Management">
                    Public Market and Vendor Management
                  </SelectItem>
                  <SelectItem value="Office of the Senior Citizen Management">
                    Office of the Senior Citizen Management
                  </SelectItem>
                  <SelectItem value="Healthcare And Social Welfare">
                    Healthcare And Social Welfare
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {state?.errors?.documentType && <p>{state.errors.documentType}</p>}
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
