import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
  className?: string;
}

interface ContentProps {
  children: ReactNode;
  className?: string;
}

const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <main
      className={cn(
        "min-h-svh w-screen flex items-start justify-center font-archivo bg-surface dark:bg-zinc-950 md:py-5 md:items-center overflow-hidden pt-safe",
        className,
      )}
    >
      {children}
    </main>
  );
};

const Content = ({ children, className }: ContentProps) => {
  return (
    <section
      className={cn(
        "flex flex-col pt-4 pb-8 px-5 w-full bg-base dark:bg-zinc-900 border border-border-subtle dark:border-zinc-800 shadow-md md:w-5/6 md:rounded-2xl md:max-w-xl min-h-svh md:min-h-0 md:h-[85vh] relative",
        className,
      )}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gold-gradient" />
      {children}
    </section>
  );
};

const Container = {
  wrapper: Wrapper,
  content: Content,
};

export { Container };
