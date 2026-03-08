"use client";

import { use, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { AuditLogAction, DocumentStatus } from "@/lib/generated/prisma/enums";

export default function DataTable({
  data,
}: {
  data: Promise<
    ({
      user: {
        email: string;
      };
      document:
        | ({
            documentType: {
              name: string;
            };
          } & {
            id: string;
            createdAt: Date;
            version: number;
            status: DocumentStatus;
            filePath: string | null;
            location: string;
            expirationDate: Date | null;
            isDeleted: boolean;
            backupPath: string | null;
            ownerId: string;
            documentTypeId: string;
            renewedFromId: string | null;
          })
        | null;
    } & {
      id: string;
      action: AuditLogAction;
      details: string | null;
      ipAddress: string;
      createdAt: Date;
      userId: string;
      documentId: string | null;
    })[]
  >;
}) {
  const audits = use(data);
  const [search, setSearch] = useState("");
  const [operationFilter, setOperationFilter] = useState("all");

  const filteredData = useMemo(() => {
    return audits.filter((d) => {
      const q = search.toLowerCase();
      const searchMatch =
        d.user.email.toLowerCase().includes(q) ||
        d.document?.documentType.name.toLowerCase().includes(q) ||
        d.ipAddress.toLowerCase().includes(q);

      const operationMatch =
        operationFilter === "all" || d.action === operationFilter;

      return searchMatch && operationMatch;
    });
  }, [audits, search, operationFilter]);

  return (
    <>
      <Card className="mb-4">
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search user, document type, ip address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:max-w-sm"
            />
            <Select value={operationFilter} onValueChange={setOperationFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All operations</SelectItem>
                <SelectItem value="DOCUMENT_MODIFIED">
                  Document modified
                </SelectItem>
                <SelectItem value="DOCUMENT_DELETED">
                  Document deleted
                </SelectItem>
                <SelectItem value="DOCUMENT_BACKUP">Backup created</SelectItem>
                <SelectItem value="DOCUMENT_RESTORED">
                  Document restored
                </SelectItem>
                <SelectItem value="DOCUMENT_RENEWED">
                  Document renewed
                </SelectItem>
                <SelectItem value="DOCUMENT_ARCHIVED">
                  Document archived
                </SelectItem>
                <SelectItem value="DOCUMENT_UNARCHIVED">
                  Document unarchived
                </SelectItem>
                <SelectItem value="DOCUMENT_BORROWED">
                  Document borrow approved
                </SelectItem>
                <SelectItem value="DOCUMENT_REFUSED">
                  Document borrow refused
                </SelectItem>
                <SelectItem value="DOCUMENT_RETURNED">
                  Document returned
                </SelectItem>
                <SelectItem value="DOCUMENT_LOCATION_CHANGE">
                  Location changed
                </SelectItem>
                <SelectItem value="ACCOUNT_CREATED">Account created</SelectItem>
                <SelectItem value="ACCOUNT_MODIFIED">
                  Account modified
                </SelectItem>
                <SelectItem value="ACCOUNT_DELETED">Account deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.createdAt.toLocaleString()}</TableCell>
                  <TableCell>
                    {d.action === "DOCUMENT_BORROWED"
                      ? "DOCUMENT_BORROW_APPROVED"
                      : d.action === "DOCUMENT_REFUSED"
                        ? "DOCUMENT_BORROW_REFUSED"
                        : d.action}
                  </TableCell>
                  <TableCell>{d.document?.documentType.name || "--"}</TableCell>
                  <TableCell>{d.user.email}</TableCell>
                  <TableCell>{d.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
