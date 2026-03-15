"use server";

import { cookies } from "next/headers";

export async function setThemeCookie(theme: "dark" | "light") {
  const cookieStore = await cookies();
  cookieStore.set("admin-theme", theme, {
    path: "/",
    httpOnly: false, // readable client-side if needed
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
