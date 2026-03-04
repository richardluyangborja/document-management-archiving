"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Folder, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserNavigationMenu() {
  const path = usePathname();

  return (
    <div className="border-b border-border px-10 py-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Button
                asChild
                variant={path === "/profile" ? "secondary" : "ghost"}
              >
                <Link href="/profile">
                  <UserRound />
                  Profile
                </Link>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Button
                asChild
                variant={path === "/documents" ? "secondary" : "ghost"}
              >
                <Link href="/documents">
                  <Folder />
                  Documents
                </Link>
              </Button>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
