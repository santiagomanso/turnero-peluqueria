import { Home, Share2 } from "lucide-react";
import Link from "next/link";

type Props = {
  title?: string;
};

export default function Navbar({ title }: Props) {
  return (
    <nav className="flex justify-between items-center ">
      <Link href={"/"} className="p-2 rounded-full border text-white">
        <Home strokeWidth={1.5} className="h-5 w-5" />
      </Link>
      {title && <h2 className="text-white text-xl font-archivo">{title}</h2>}
      <button className="p-2 rounded-full border text-white">
        <Share2 strokeWidth={1.5} className="h-5 w-5" />
      </button>
    </nav>
  );
}
