import { Home, Share2 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center '>
      <Link href={"/"} className='p-2 rounded-full border text-white'>
        <Home strokeWidth={1.5} className='h-5 w-5' />
      </Link>

      <button className='p-2 rounded-full border text-white'>
        <Share2 strokeWidth={1.5} className='h-5 w-5' />
      </button>
    </nav>
  );
}
