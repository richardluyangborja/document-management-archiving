import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { SESSION_COOKIE_KEY } from "./session-constants";
import { decrypt } from "./session";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(SESSION_COOKIE_KEY)?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId, role: session.role };
});
