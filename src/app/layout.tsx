import { Archivo, Dancing_Script, Heebo } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`
        ${archivo.variable}
        ${archivoBlack.variable}
        ${dancingScript.variable}
        ${heebo.variable}
        antialiased
      `}
    >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
