import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Archive, FolderSync, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigations = [
    {
      label: "Backup",
      href: "/admin/retrieval/backup",
      icon: Archive,
    },
    {
      label: "Restore",
      href: "/admin/retrieval/restore",
      icon: FolderSync,
    },
    {
      label: "Update/Renew",
      href: "/admin/retrieval/update",
      icon: RotateCcw,
    },
  ]
  return (
    <>
      <header className="px-4 py-2 border-b border-border">
        <NavigationMenu className="">
          <NavigationMenuList>
            {navigations.map((nav, i) => (
              <NavigationMenuItem key={i} className="mr-4">
                <NavigationMenuLink asChild>
                  <Button asChild variant="ghost" size="lg">
                    <Link href={nav.href}>
                      <nav.icon />
                      {nav.label}
                    </Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <main>
        {children}
      </main>
    </>
  )
}
