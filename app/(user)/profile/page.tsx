import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Pencil, UserRound } from "lucide-react";
import EditAddress from "./EditAddress";
import EditFullname from "./EditFullname";
import EditBirthDate from "./EditBirthDate";
import EditContactNumber from "./EditContactNumber";

export default async function page() {
  const { userId } = await verifySession();
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  return (
    <>
      <div className="p-4">
        <p className="text-xl font-semibold">My Profile</p>
        <p className="font-light text-muted-foreground">
          View your account information
        </p>
      </div>
      <div className="p-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-4 py-4 mb-8 border-b border-border">
              <div className="p-4 bg-secondary rounded-full w-fit">
                <UserRound size={42} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{user.fullname}</p>
                <EditFullname />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-12 py-4">
              <div className="col-span-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-muted-foreground">Birthdate</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg">
                    {user.birthDate?.toLocaleDateString() ||
                      "Not yet specified"}
                  </p>
                  <EditBirthDate />
                </div>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg">
                    {user.address || "Not yet specified"}
                  </p>
                  <EditAddress />
                </div>
              </div>
              <div className="col-span-1">
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg">
                    {user.contactNumber || "Not yet specified"}
                  </p>
                  <EditContactNumber />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
