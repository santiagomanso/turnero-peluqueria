"use client";

import { Home, Sun, Moon, Settings2 } from "lucide-react";
import Link from "next/link";
import { useTheme } from "./public-theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";

type Props = {
  title?: string;
  rightElement?: React.ReactNode;
  hideSettings?: boolean;
};

function NavbarComponent({ title, rightElement, hideSettings = false }: Props) {
  const { isDark, setTheme } = useTheme();

  return (
    <nav className="flex justify-between items-center mb-5">
      <Link href="/">
        <Button variant="outline" size="icon">
          <Home strokeWidth={1.5} className="h-5 w-5" />
        </Button>
      </Link>

      {title && (
        <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-content dark:text-zinc-100">
          {title}
        </h2>
      )}

      <div className="flex items-center gap-2">
        {rightElement}

        {!hideSettings && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 dark:bg-zinc-900 dark:border-zinc-800"
            >
              <DropdownMenuItem
                onClick={() => setTheme(isDark ? "light" : "dark")}
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
                  <Home className="w-3.5 h-3.5" />
                  Administración
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}

const Navbar = dynamic(() => Promise.resolve(NavbarComponent), { ssr: false });
export default Navbar;
