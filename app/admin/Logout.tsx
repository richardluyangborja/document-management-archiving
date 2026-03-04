"use client";

import { LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/admin/logout-action";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { use } from "react";

export default function Logout({
  user,
}: {
  user: Promise<{ fullname: string }>;
}) {
  const u = use(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <UserRound /> {u.fullname} (Admin)
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          variant="destructive"
          onClick={async () => await logoutAction()}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
