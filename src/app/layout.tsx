import { Archivo, Dancing_Script, Heebo, Space_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "sonner";
import { PublicThemeProvider } from "@/components/public-theme-provider";

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
  const isDark = themeCookie?.value === "dark";
  const hasCookie = !!themeCookie;

  return (
    <html
      lang="es"
      className={`
        ${archivo.variable}
        ${archivoBlack.variable}
        ${dancingScript.variable}
        ${heebo.variable}
        ${spaceMono.variable}
        ${isDark ? "dark" : ""}
        antialiased
      `}
    >
      <body>
        <PublicThemeProvider defaultDark={isDark} hasCookie={hasCookie}>
          {children}
        </PublicThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
