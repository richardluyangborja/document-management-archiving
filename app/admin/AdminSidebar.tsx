import Logo from "../../public/logo.jpg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Folder,
  RotateCcw,
  ScanEye,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logout from "./Logout";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";

export async function AdminSidebar() {
  const { userId } = await verifySession();
  const user = prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { fullname: true },
  });

  const navigations = [
    {
      name: "Storage",
      href: "/admin/storage",
      icon: Folder,
    },
    {
      name: "Tracking",
      href: "/admin/tracking",
      icon: TrendingUp,
    },
    {
      name: "Retrieval",
      href: "/admin/retrieval/backup",
      icon: RotateCcw,
    },
    {
      name: "Audit Trail",
      href: "/admin/audit-trail",
      icon: ScanEye,
    },
    // {
    //   name: "Users Management",
    //   href: "/admin/users-management",
    //   icon: UsersRound,
    // },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-4">
              <Image src={Logo} height={40} width={40} alt="logo" />
              <p className=" font-semibold text-primary-foreground">
                Document Management Archiving
              </p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigations.map((nav) => (
              <SidebarMenuItem key={nav.name}>
                <SidebarMenuButton asChild>
                  <Link href={nav.href}>
                    <nav.icon />
                    <span>{nav.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Logout user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
