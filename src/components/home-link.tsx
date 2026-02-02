import Link from "next/link";
import { LucideIcon, Phone } from "lucide-react";

type Props = {
  label: string;
  path: string;
  icon: LucideIcon;
  type?: "external-link" | "internal-link";
};

export default function HomeLink({
  label,
  path,
  icon: Icon,
  type = "internal-link",
}: Props) {
  return type === "internal-link" ? (
    <Link
      href={path}
      className='
        w-full
        bg-pink-600/20
        border border-gray-300
        text-gray-300
        font-bold
        font-archivo
        py-4
        rounded-full
        px-6
        flex items-center justify-between
        transition
        hover:border-white
        active:scale-[0.98]
        relative
      '
    >
      <span className='text-sm tracking-wide'>{label}</span>

      <span className='absolute top-1/2 right-5 -translate-y-1/2'>
        <Icon className='w-6 h-6' />
      </span>
    </Link>
  ) : (
    <a
      target='_blank'
      rel='noreferrer'
      className=' w-full
        bg-pink-600/20
        border border-gray-300
        text-gray-300
        font-bold
        font-archivo
        py-4
        rounded-full
        px-6
        flex items-center justify-between
        transition
        hover:border-white
        active:scale-[0.98]
        relative'
      href={"https://wa.me/+5493794619887"}
    >
      <span className='text-sm tracking-wide'>{label}</span>
      <span className='absolute top-1/2 right-5 -translate-y-1/2'>
        <Icon className='w-6 h-6' />
      </span>
    </a>
  );
}
