import prisma from "@/lib/prisma";
import SelectDocument from "./SelectDocument";

export default function page() {
  const today = new Date(Date.now());
  const expiredDocs = prisma.document.findMany({
    where: { expirationDate: { lte: today }, renewedTo: { none: {} } },
    include: { documentType: true, owner: true },
  });

  return (
    <div className="h-dvh flex flex-col">
      <header className="p-4">
        <p className="text-2xl font-semibold">Update</p>
        <p className="text-lg font-light text-muted-foreground">
          Update or renew expired documents.
        </p>
      </header>
      <SelectDocument documents={expiredDocs} />
    </div>
  );
}
