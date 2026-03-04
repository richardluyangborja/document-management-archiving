"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { logoutAction } from "../admin/logout-action";
import { use } from "react";
import { Role } from "@/lib/generated/prisma/enums";

export default function LogoutDropdown({
  user,
}: {
  user: Promise<{
    id: string;
    email: string;
    fullname: string;
    birthDate: Date | null;
    address: string | null;
    contactNumber: string | null;
    passwordHash: string;
    role: Role;
    createdAt: Date;
  }>;
}) {
  const u = use(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-primary-foreground">
          <UserRound />
          {u.email}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={async () => await logoutAction()}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
