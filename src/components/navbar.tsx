import { Home, UserRound } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

type Props = {
  title?: string;
};

export default function Navbar({ title }: Props) {
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

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/admin"
          className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-border-subtle dark:border-zinc-700 text-content dark:text-zinc-100 transition-colors"
        >
          <UserRound strokeWidth={1.5} className="h-5 w-5" />
        </Link>
      </div>
    </nav>
  );
}
