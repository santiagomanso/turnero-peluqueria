"use client";

import dynamic from "next/dynamic";

const HomeDesktop = dynamic(
  () => import("./home-desktop").then((m) => m.HomeDesktop),
  { ssr: false }
);

export function HomeDesktopWrapper() {
  return <HomeDesktop />;
}
