import { Archivo, Dancing_Script, Heebo, Space_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { PublicThemeProvider } from "@/components/public-theme-provider";
import { PageTransition } from "@/components/page-transition";
import { Toaster } from "@/components/ui/sonner";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-archivo",
});

const archivoBlack = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  variable: "--font-archivo-black",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
});

const heebo = Heebo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-heebo",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("admin-theme");
  const themeValue = themeCookie?.value as "dark" | "light" | "system" | undefined;
  const validTheme: "dark" | "light" | "system" =
    themeValue === "dark" || themeValue === "light" || themeValue === "system"
      ? themeValue
      : "system";

  return (
    <html
      lang="es"
      className={`
        ${archivo.variable}
        ${archivoBlack.variable}
        ${dancingScript.variable}
        ${heebo.variable}
        ${spaceMono.variable}
        ${validTheme === "dark" ? "dark" : ""}
        antialiased
      `}
    >
      <body>
        <PublicThemeProvider defaultTheme={validTheme}>
          <PageTransition>
            {children}
          </PageTransition>
        </PublicThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
