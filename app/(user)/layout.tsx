import Logo from "../../public/logo.jpg";

import Image from "next/image";
import UserNavigationMenu from "./NavigationMenu";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import LogoutDropdown from "./LogoutDropdown";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await verifySession();
  const user = prisma.user.findUniqueOrThrow({ where: { id: userId } });

  return (
    <>
      <header className="bg-sidebar flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Image src={Logo} height={40} width={40} alt="logo" />
          <p className="text-2xl font-semibold text-primary-foreground">
            Document Management Archiving
          </p>
        </div>
        <LogoutDropdown user={user} />
      </header>
      <UserNavigationMenu />
      <main>{children}</main>
    </>
  );
}
