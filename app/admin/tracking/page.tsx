import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./DataTable";
import { Archive, Folder, HandHelping } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function page() {
  const docs = prisma.document.findMany({
    include: { documentType: true, owner: true, borrows: true },
    where: { isDeleted: false },
  });
  const documents = await docs;
  const computedDocs = documents.map((d) => {
    const activeBorrow = d.borrows.filter((a) => a.status === "ACTIVE");
    return {
      ...d,
      status: activeBorrow.length !== 0 ? "BORROWED" : d.status,
    };
  });
  const totalDocs = documents.length;
  const borrowedDocs = computedDocs.filter(
    (d) => d.status === "BORROWED",
  ).length;
  const archivedDocs = documents.filter((d) => d.status === "ARCHIVED").length;

  return (
    <>
      <header className="p-4">
        <p className="text-2xl font-semibold">Documents Location and Status</p>
        <p className="text-lg font-light text-muted-foreground">
          Monitor document status and locations.
        </p>
      </header>
      <section className="grid grid-cols-12 gap-12 px-4 py-4">
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">Total documents</p>
            <div className="flex items-center gap-2">
              <Folder />
              <p className="text-2xl font-semibold">{totalDocs}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">
              Borrowed documents
            </p>
            <div className="flex items-center gap-2">
              <HandHelping />
              <p className="text-2xl font-semibold">{borrowedDocs}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">
              Archived documents
            </p>
            <div className="flex items-center gap-2">
              <Archive />
              <p className="text-2xl font-semibold">{archivedDocs}</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="px-4">
        <DataTable documents={docs} />
      </section>
    </>
  );
}
