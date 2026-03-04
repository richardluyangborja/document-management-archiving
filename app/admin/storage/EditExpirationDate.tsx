"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, InfoIcon } from "lucide-react";
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
import { useActionState, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { editExpirationDateAction } from "./actions";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function EditExpirationDate({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    editExpirationDateAction,
    undefined,
  );

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  function formatDate(date: Date | undefined) {
    if (!date) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function isValidDate(date: Date | undefined) {
    if (!date) {
      return false;
    }
    return !isNaN(date.getTime());
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit expiration date
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expiration Date</DialogTitle>
          <DialogDescription>
            This action will change the expiration date of the document in the
            record
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
          <Field data-invalid={state?.errors?.expirationDate ? true : false}>
            <FieldLabel htmlFor="input-field-expiration-date">
              Expiration date
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                aria-invalid={state?.errors?.expirationDate ? true : false}
                id="input-field-expiration-date"
                value={value}
                name="expirationDate"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setValue(e.target.value);
                  if (isValidDate(date)) {
                    setDate(date);
                    setMonth(date);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <InputGroupButton
                      id="date-picker"
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Select date"
                    >
                      <CalendarIcon />
                      <span className="sr-only">Select date</span>
                    </InputGroupButton>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="end"
                    alignOffset={-8}
                    sideOffset={10}
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      month={month}
                      onMonthChange={setMonth}
                      onSelect={(date) => {
                        setDate(date);
                        setValue(formatDate(date));
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </InputGroupAddon>
            </InputGroup>
            {state?.errors?.expirationDate && (
              <p>{state.errors.expirationDate}</p>
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
