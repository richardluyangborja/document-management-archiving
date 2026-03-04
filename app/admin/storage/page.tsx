import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Download, Ellipsis, Folder } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { DocumentStatus, Role } from "@/lib/generated/prisma/enums";
import EditVersion from "./EditVersion";
import EditDocumentType from "./EditDocumentType";
import EditDocumentOwner from "./EditSubject";
import EditExpirationDate from "./EditExpirationDate";
import { Badge } from "@/components/ui/badge";
import DeleteDocument from "./DeleteDocument";

export default async function page() {
  // const user = await verifySession();
  const documents = await prisma.document.findMany({
    include: { owner: true, documentType: true },
    where: { isDeleted: false },
  });

  const documentTypeConfig = [
    {
      documentType: "Community Engagement",
      data: documents.filter(
        (d) => d.documentType.name === "Community Engagement",
      ),
      color: "bg-purple-200",
    },
    {
      documentType: "Revenue Collection and Real Property Tax",
      data: documents.filter(
        (d) =>
          d.documentType.name === "Revenue Collection and Real Property Tax",
      ),
      color: "bg-red-200",
    },
    {
      documentType: "Election Voting Management",
      data: documents.filter(
        (d) => d.documentType.name === "Election Voting Management",
      ),
      color: "bg-orange-200",
    },
    {
      documentType: "Barangay Management",
      data: documents.filter(
        (d) => d.documentType.name === "Barangay Management",
      ),
      color: "bg-blue-200",
    },
    {
      documentType: "Disaster Response And Solid Waste",
      data: documents.filter(
        (d) => d.documentType.name === "Disaster Response And Solid Waste",
      ),
      color: "bg-teal-200",
    },
    {
      documentType: "Business Permit and Licensing",
      data: documents.filter(
        (d) => d.documentType.name === "Business Permit and Licensing",
      ),
      color: "bg-yellow-200",
    },
    {
      documentType: "Public Market and Vendor Management",
      data: documents.filter(
        (d) => d.documentType.name === "Public Market and Vendor Management",
      ),
      color: "bg-pink-100",
    },
    {
      documentType: "Office of the Senior Citizen Management",
      data: documents.filter(
        (d) =>
          d.documentType.name === "Office of the Senior Citizen Management",
      ),
      color: "bg-olive-300",
    },
    {
      documentType: "Healthcare And Social Welfare",
      data: documents.filter(
        (d) => d.documentType.name === "Healthcare And Social Welfare",
      ),
      color: "bg-lime-200",
    },
  ];

  return (
    <>
      <header className="flex items-center justify-between p-4">
        <div>
          <p className="text-2xl font-semibold">List of Documents</p>
          <p className="text-lg font-light text-muted-foreground">
            Browse all document records.
          </p>
        </div>
        {/* <Button size='lg'> */}
        {/*   Register new document */}
        {/*   <Plus /> */}
        {/* </Button> */}
      </header>
      <section className="flex flex-col gap-4 p-4">
        {documentTypeConfig.map((docType, i) => (
          <DocumentType
            key={i}
            title={docType.documentType}
            documents={docType.data}
            color={docType.color}
          />
        ))}
      </section>
    </>
  );
}

export async function DocumentType({
  title,
  color,
  documents,
}: {
  title: string;
  color: string;
  documents: ({
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
  })[];
}) {
  const users = prisma.user.findMany({
    select: {
      id: true,
      fullname: true,
      email: true,
    },
    orderBy: { fullname: "asc" },
    where: { NOT: { role: "ADMIN" } },
  });

  return (
    <Card className={`col-span-12 ${color}`}>
      <CardContent>
        <Collapsible className="data-[state=open]:bg-muted rounded-md">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group w-full">
              <Folder />
              {title}
              <ChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Version</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="w-20">{doc.version}</TableCell>
                    <TableCell>{doc.owner.fullname}</TableCell>
                    <TableCell>{doc.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {new Date() > new Date(doc.expirationDate!) &&
                        doc.status !== "BORROWED" &&
                        doc.status !== "ARCHIVED"
                          ? "expired"
                          : doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {doc.expirationDate!.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <Ellipsis />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <EditVersion id={doc.id} />
                          <EditDocumentType id={doc.id} />
                          <EditDocumentOwner id={doc.id} users={users} />
                          <EditExpirationDate id={doc.id} />
                          <DropdownMenuSeparator />
                          <DeleteDocument docId={doc.id} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="default" size="icon-lg">
                        <a
                          href="/uploads/example.pdf"
                          download={`${doc.owner.fullname}_${doc.documentType.name}`}
                        >
                          <Download />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
