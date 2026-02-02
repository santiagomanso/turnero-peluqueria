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
        "bg-linear-to-br from-fuchsia-950 to-purple-900 h-svh w-screen flex items-start justify-center font-archivo pt-10",
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
        "bg-linear-to-br from-pink-500 to-fuchsia-950 max-w-4xl flex flex-col justify-center pt-4 pb-8 px-4 sm:w-5/6 lg:w-sm rounded-lg",
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
