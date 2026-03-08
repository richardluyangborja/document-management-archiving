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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BorrowStatus,
  DocumentStatus,
  Role,
} from "@/lib/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import UpdateLocation from "./UpdateLocation";
import ReturnDocument from "./ReturnDocument";
import DeleteDocument from "./DeleteDocument";

export default function DataTable({
  documents,
}: {
  documents: Promise<
    ({
      owner: {
        id: string;
        createdAt: Date;
        fullname: string;
        birthDate: Date | null;
        address: string | null;
        contactNumber: string | null;
        email: string;
        passwordHash: string;
        role: Role;
      };
      documentType: {
        id: string;
        name: string;
        description: string | null;
      };
      borrows: {
        id: string;
        status: BorrowStatus;
        createdAt: Date;
        borrowDate: Date;
        dueDate: Date | null;
        returnDate: Date | null;
        documentId: string;
        borrowerId: string;
      }[];
    } & {
      id: string;
      filePath: string | null;
      location: string;
      status: DocumentStatus;
      version: number;
      expirationDate: Date | null;
      createdAt: Date;
      ownerId: string;
      documentTypeId: string;
      renewedFromId: string | null;
    })[]
  >;
}) {
  const docs = use(documents);

  const computedDocs = docs.map((d) => {
    const activeBorrow = d.borrows.filter((a) => a.status === "ACTIVE");
    const pendingBorrow = d.borrows.filter((a) => a.status === "PENDING");
    if (activeBorrow.length !== 0)
      return {
        ...d,
        status: "BORROWED",
        transactionId: activeBorrow.length !== 0 ? activeBorrow[0].id : null,
      };
    return {
      ...d,
      status: pendingBorrow.length !== 0 ? "PENDING" : d.status,
      transactionId: pendingBorrow.length !== 0 ? pendingBorrow[0].id : null,
    };
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = useMemo(() => {
    const today = new Date();

    return computedDocs.filter((d) => {
      const q = search.toLowerCase();
      const searchMatch =
        d.owner.fullname.toLowerCase().includes(q) ||
        d.documentType.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q);

      const exp = new Date(d.expirationDate!);
      const isExpired = exp < today;

      const computedStatus = isExpired ? "EXPIRED" : d.status;

      const statusMatch =
        statusFilter === "all" || computedStatus === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [computedDocs, search, statusFilter]);
  return (
    <>
      <Card className="mb-4">
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search subject, document type, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BORROWED">Borrowed</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Version</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="w-20">{d.version}</TableCell>
                  <TableCell>{d.documentType.name}</TableCell>
                  <TableCell>{d.owner.fullname}</TableCell>
                  <TableCell>{d.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {new Date() > new Date(d.expirationDate!) &&
                      d.status !== "BORROWED" &&
                      d.status !== "ARCHIVED"
                        ? "EXPIRED"
                        : d.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {d.expirationDate!.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Ellipsis />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {d.status === "BORROWED" && (
                          <ReturnDocument transactionId={d.transactionId!} />
                        )}
                        <UpdateLocation id={d.id} />
                        <DropdownMenuSeparator />
                        <DeleteDocument docId={d.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
