import prisma from "@/lib/prisma";
import SelectDocument from "./SelectDocument";

export default async function page() {
  const documents = prisma.document.findMany({
    include: { documentType: true, owner: true },
  });

  return (
    <div className="h-dvh flex flex-col">
      <header className="p-4">
        <p className="text-2xl font-semibold">Backup</p>
        <p className="text-lg font-light text-muted-foreground">
          Backup documents.
        </p>
      </header>
      <SelectDocument documents={documents} />
    </div>
  );
}
