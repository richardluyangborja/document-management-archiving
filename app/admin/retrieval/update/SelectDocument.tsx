"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentStatus, Role } from "@/lib/generated/prisma/enums";
import { Download, RotateCcw } from "lucide-react";
import { use, useState, useTransition } from "react";
import { toast } from "sonner";
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { renewDocumentAction } from "./renew-document-action";

export default function SelectDocument({
  documents,
}: {
  documents: Promise<
    ({
      owner: {
        address: string | null;
        id: string;
        role: Role;
        email: string;
        createdAt: Date;
        fullname: string;
        birthDate: Date | null;
        contactNumber: string | null;
        passwordHash: string;
      };
      documentType: {
        name: string;
        id: string;
        description: string | null;
      };
    } & {
      id: string;
      status: DocumentStatus;
      backupPath: string | null;
      version: number;
      filePath: string | null;
      location: string;
      expirationDate: Date | null;
      isDeleted: boolean;
      createdAt: Date;
      ownerId: string;
      documentTypeId: string;
      renewedFromId: string | null;
    })[]
  >;
}) {
  const docs = use(documents);

  const [selectedDocs, setSelectedDocs] = useState<
    | ({
        owner: {
          address: string | null;
          id: string;
          role: Role;
          email: string;
          createdAt: Date;
          fullname: string;
          birthDate: Date | null;
          contactNumber: string | null;
          passwordHash: string;
        };
        documentType: {
          name: string;
          id: string;
          description: string | null;
        };
      } & {
        id: string;
        status: DocumentStatus;
        backupPath: string | null;
        version: number;
        filePath: string | null;
        location: string;
        expirationDate: Date | null;
        isDeleted: boolean;
        createdAt: Date;
        ownerId: string;
        documentTypeId: string;
        renewedFromId: string | null;
      })
    | undefined
  >(undefined);
  const [date, setDate] = React.useState<Date>();
  const today = new Date();

  const [isPending, startTransition] = useTransition();

  return (
    <section className="px-4">
      <Card>
        <CardHeader>
          <CardTitle>Renew a document</CardTitle>
          <CardDescription>
            Renewing a document will archive the older version and create a new
            document with the next version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <label>Select a document</label>
              <Select
                onValueChange={(value) =>
                  setSelectedDocs(docs.find((d) => d.id === value))
                }
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {docs.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.status} | Version {d.version}: {d.documentType.name}{" "}
                        | {d.owner.fullname}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectedDocs && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p>Version {selectedDocs.version}</p>
                    <p>{selectedDocs.documentType.name}</p>
                    <p>{selectedDocs.owner.fullname}</p>
                  </div>
                  <Button asChild className="mt-4" variant="outline">
                    <a
                      href="/uploads/example.pdf"
                      download={`${selectedDocs.owner.fullname}_${selectedDocs.documentType.name}`}
                    >
                      <Download />
                      Download File
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
            <Field className="w-44">
              <FieldLabel htmlFor="date-picker-simple">
                Pick a new expiration date
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker-simple"
                    className="justify-start font-normal"
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    disabled={{ before: today }}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            <Button
              size="lg"
              disabled={!selectedDocs || isPending || !date}
              onClick={() =>
                startTransition(async () => {
                  if (!selectedDocs) return;
                  await renewDocumentAction(selectedDocs.id, date!);
                  setSelectedDocs(undefined);
                  toast("Document renewed successfully.");
                })
              }
            >
              Renew document
              <RotateCcw />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
