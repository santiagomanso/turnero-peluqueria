import { Menu, Share2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className='flex justify-between items-center '>
      <button className='p-2 rounded-full border text-white'>
        <Menu strokeWidth={1.5} className='h-5 w-5' />
      </button>

      <button className='p-2 rounded-full border text-white'>
        <Share2 strokeWidth={1.5} className='h-5 w-5' />
      </button>
    </nav>
  );
}
