"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentStatus, Role } from "@/lib/generated/prisma/enums";
import { Download, FolderSync } from "lucide-react";
import { use, useState, useTransition } from "react";
import { restoreAction } from "./restore-action";
import { toast } from "sonner";

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

  const [isPending, startTransition] = useTransition();

  return (
    <section className="px-4">
      <Card>
        <CardHeader>
          <CardTitle>Restore a document</CardTitle>
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
                    {docs
                      .filter((d) => d.isDeleted && d.backupPath)
                      .map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.status} | Version {d.version}:{" "}
                          {d.documentType.name} | {d.owner.fullname}
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
            <Button
              size="lg"
              disabled={!selectedDocs || isPending}
              onClick={() =>
                startTransition(async () => {
                  if (!selectedDocs) return;
                  await restoreAction(selectedDocs.id);
                  setSelectedDocs(undefined);
                  toast("Document restored successfully.");
                })
              }
            >
              Restore document
              <FolderSync />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
