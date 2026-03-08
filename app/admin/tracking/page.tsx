import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "./DataTable";
import { Archive, Folder, HandHelping } from "lucide-react";
import prisma from "@/lib/prisma";
import ConfirmBorrow from "./ConfirmBorrow";
import RefuseBorrow from "./RefuseBorrow";

export default async function page() {
  const docs = prisma.document.findMany({
    include: {
      documentType: true,
      owner: true,
      borrows: { include: { borrower: true } },
    },
    where: { isDeleted: false },
  });
  const documents = await docs;
  const computedDocs = documents.map((d) => {
    const activeBorrow = d.borrows.filter((a) => a.status === "ACTIVE");
    const pendingBorrow = d.borrows.filter((a) => a.status === "PENDING");
    if (activeBorrow.length !== 0)
      return {
        ...d,
        status: "BORROWED",
        borrower:
          activeBorrow.length !== 0 ? activeBorrow[0].borrower.fullname : null,
        borrowerId:
          activeBorrow.length !== 0 ? activeBorrow[0].borrower.id : null,
        transactionId: activeBorrow.length !== 0 ? activeBorrow[0].id : null,
      };
    return {
      ...d,
      status: pendingBorrow.length !== 0 ? "PENDING" : d.status,
      borrower:
        pendingBorrow.length !== 0 ? pendingBorrow[0].borrower.fullname : null,
      borrowerId:
        pendingBorrow.length !== 0 ? pendingBorrow[0].borrower.id : null,
      transactionId: pendingBorrow.length !== 0 ? pendingBorrow[0].id : null,
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
      <section className="px-4 mb-4 ">
        <Card>
          <CardHeader>
            <CardTitle>Borrow Requests</CardTitle>
            <CardDescription>
              Documents that are requested for borrowing will appear here.
            </CardDescription>
            <CardContent>
              <div className="flex flex-col gap-4 py-4">
                {computedDocs
                  .filter((d) => d.status === "PENDING")
                  .map((d) => (
                    <Card key={d.id}>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <p>
                            {d.borrower} is requesting to borrow the document V
                            {d.version} {d.documentType.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <ConfirmBorrow transactionId={d.transactionId!} />
                            <RefuseBorrow transactionId={d.transactionId!} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </section>
      <section className="px-4">
        <DataTable documents={docs} />
      </section>
    </>
  );
}
