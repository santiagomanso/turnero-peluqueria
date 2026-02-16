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
        "bg-linear-to-br from-fuchsia-950 to-purple-900 min-h-svh w-screen flex items-start justify-center font-archivo py-5 md:items-center overflow-hidden",
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
        "bg-linear-to-br from-pink-500 to-fuchsia-950 flex flex-col pt-4 pb-8 px-4 sm:w-5/6 rounded-lg w-[90%] md:max-w-xl h-[85vh]",
        className,
      )}
    >
      {children}
    </section>
  );
};

// Compound component pattern
const Container = {
  wrapper: Wrapper,
  content: Content,
};

export { Container };
