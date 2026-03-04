import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Download,
  Folder,
  Info,
  MapPin,
  MoveUpRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";

export default async function page() {
  const { userId } = await verifySession();
  const documents = await prisma.document.findMany({
    where: { ownerId: userId },
    include: { documentType: true, owner: true },
  });
  const archived = documents.filter((d) => d.status === "ARCHIVED");
  const borrowed = documents.filter((d) => d.status === "BORROWED");

  return (
    <>
      <div className="p-4">
        <p className="text-xl font-semibold">My Documents</p>
        <p className="font-light text-muted-foreground">
          View and access your documents
        </p>
      </div>
      <div className="px-4 grid grid-cols-12 gap-4">
        <Card className="col-span-4">
          <CardContent>
            <div>
              <p className="text-muted-foreground">Total Documents</p>
              <p className="text-3xl font-semibold">{documents.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent>
            <div>
              <p className="text-muted-foreground">Archived Documents</p>
              <p className="text-3xl font-semibold">{archived.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardContent>
            <div>
              <p className="text-muted-foreground">Borrowed Documents</p>
              <p className="text-3xl font-semibold">{borrowed.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="p-4">
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle>Document List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {documents.map((d) => (
                <div key={d.id} className="border border-border p-2 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Folder />
                    <div>
                      <div className="flex items-center gap-2">
                        <p>{d.documentType.name}</p>
                        <Badge variant="outline">{d.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Version {d.version}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button asChild>
                      <a
                        href="/uploads/example.pdf"
                        download={`${d.owner.fullname}_${d.documentType.name}`}
                      >
                        <Download />
                        Download
                      </a>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          View full details
                          <MoveUpRight />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{d.documentType.name}</DialogTitle>
                          <DialogDescription>
                            Version {d.version}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="text-muted-foreground flex items-center gap-2">
                              <MapPin size={20} />
                              <p>Location</p>
                            </div>
                            <p>{d.location}</p>
                          </div>
                          <div>
                            <div className="text-muted-foreground flex items-center gap-2">
                              <Calendar size={20} />
                              <p>Expiration Date</p>
                            </div>
                            <p>{d.expirationDate?.toLocaleDateString()}</p>
                          </div>
                          <div>
                            <div className="text-muted-foreground flex items-center gap-2">
                              <Info size={20} />
                              <p>Status</p>
                            </div>
                            <p>{d.status}</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button className="w-full" asChild>
                            <a
                              href="/uploads/example.pdf"
                              download={`${d.owner.fullname}_${d.documentType.name}`}
                            >
                              <Download />
                              Download
                            </a>
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
