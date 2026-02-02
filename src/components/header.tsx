import Image from "next/image";

export default function Header() {
  return (
    <header className='flex flex-col items-center text-center'>
      <picture
        className='
              w-24 h-24 rounded-full
              border border-white
              flex items-center justify-center
              overflow-hidden mb-3
            '
      >
        {/* Logo */}
        <Image
          src='/logo.png'
          alt='Luckete Colorista Logo'
          width={5}
          height={5}
          className='w-full h-full object-contain'
          priority
        />
      </picture>

      <h1 className='font-bold font-heebo text-4xl tracking-wide text-white'>
        Luckete Colorista
      </h1>

      <p className=' leading-relaxed text-xl font-semibold font-dancingScript text-gray-300 px-4 '>
        Donde el color se vuelve arte.
      </p>
    </header>
  );
}
