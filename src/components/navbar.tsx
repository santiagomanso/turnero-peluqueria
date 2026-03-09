"use client";

import { Home, UserRound, Sliders, Sun, Moon, Settings2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./public-theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  title?: string;
};

export default function Navbar({ title }: Props) {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="flex justify-between items-center mb-5">
      <Link
        href="/"
        className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-content dark:text-zinc-100 transition-colors"
      >
        <Home strokeWidth={1.5} className="h-5 w-5" />
      </Link>

      {title && (
        <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-content dark:text-zinc-100">
          {title}
        </h2>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-content dark:text-zinc-100 transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 dark:bg-zinc-900 dark:border-zinc-800"
        >
          <DropdownMenuItem
            onClick={toggle}
            className="text-xs gap-2 cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
            {isDark ? "Modo claro" : "Modo oscuro"}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="dark:bg-zinc-800" />

          <Link href="/admin">
            <DropdownMenuItem className="text-xs gap-2 cursor-pointer">
              <UserRound className="w-3.5 h-3.5" />
              Administración
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
