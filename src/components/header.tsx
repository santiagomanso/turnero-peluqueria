import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col items-center text-center mb-4">
      <div className="flex items-end gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden bg-white border border-border-subtle shrink-0">
          <Image
            src="/logo.png"
            alt="Luckete Colorista Logo"
            width={56}
            height={56}
            className="w-full h-full object-contain p-2"
            priority
          />
        </div>
        <div className="text-left">
          <h1 className="font-bold font-heebo text-2xl tracking-tight leading-tight text-content">
            Luckete Colorista
          </h1>
          <p className="text-[0.65rem] uppercase tracking-[0.14em] font-archivo text-gold">
            Donde el color se vuelve arte
          </p>
        </div>
      </div>
      <div className="w-8 h-px mt-2 bg-gold-gradient" />
    </header>
  );
}
