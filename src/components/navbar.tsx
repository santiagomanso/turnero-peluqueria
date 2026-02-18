import { Home, Share2 } from "lucide-react";
import Link from "next/link";

type Props = {
  title?: string;
};

export default function Navbar({ title }: Props) {
  return (
    <nav className="flex justify-between items-center mb-5">
      <Link
        href={"/"}
        className="p-2 -ml-1 rounded-lg bg-white border border-border-subtle text-content transition-colors hover:text-content"
      >
        <Home strokeWidth={1.5} className="h-5 w-5" />
      </Link>

      {title && (
        <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-content">
          {title}
        </h2>
      )}

      <button className="p-2 rounded-lg bg-white border border-border-subtle text-content transition-colors hover:text-content">
        <Share2 strokeWidth={1.5} className="h-5 w-5" />
      </button>
    </nav>
  );
}
