"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(theme: "dark" | "light" | "system") {
  const cookieStore = await cookies();
  cookieStore.set("admin-theme", theme, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
