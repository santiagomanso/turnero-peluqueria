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
        "min-h-svh w-screen flex items-start justify-center font-archivo bg-surface md:py-5 md:items-center overflow-hidden",
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
        "flex flex-col pt-4 pb-8 px-5 w-full bg-base border border-border-subtle shadow-md md:w-5/6 md:rounded-2xl md:max-w-xl min-h-svh md:min-h-0 md:h-[85vh] relative overflow-hidden",
        className,
      )}
    >
      {/* Gold accent line — top center */}
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
