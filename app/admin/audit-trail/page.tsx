import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./DataTable";
import { Server, UserRound, Wrench } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function page() {
  const audits = prisma.auditLog.findMany({
    include: {
      document: { include: { documentType: { select: { name: true } } } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  const uniqueIps = [...new Set((await audits).map((log) => log.ipAddress))];
  const uniqueEmails = [
    ...new Set((await audits).map((log) => log.user.email)),
  ];

  return (
    <>
      <header className="p-4">
        <p className="text-2xl font-semibold">Audit Trail</p>
        <p className="text-lg font-light text-muted-foreground">
          Complete log of all system operations and modifications.
        </p>
      </header>
      <section className="grid grid-cols-12 gap-12 px-4 py-4">
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">Total Operations</p>
            <div className="flex items-center gap-2">
              <Wrench />
              <p className="text-2xl font-semibold">{(await audits).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">
              Unique IP Addresses
            </p>
            <div className="flex items-center gap-2">
              <Server />
              <p className="text-2xl font-semibold">{uniqueIps.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent className="flex flex-col gap-2">
            <p className="font-light text-muted-foreground">Unique users</p>
            <div className="flex items-center gap-2">
              <UserRound />
              <p className="text-2xl font-semibold">{uniqueEmails.length}</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="px-4">
        <DataTable data={audits} />
      </section>
    </>
  );
}
