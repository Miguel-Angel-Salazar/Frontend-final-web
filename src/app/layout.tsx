import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { themeInitScript } from "@/features/common/hooks/useTheme";
import { SiteFooter } from "@/features/common/components/layout/SiteFooter";
import { SiteHeader } from "@/features/common/components/layout/SiteHeader";
import { SessionExpiryListener } from "@/features/common/components/layout/SessionExpiryListener";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Respawn | Tienda gamer",
    template: "%s | Respawn",
  },
  description:
    "Juegos, consolas, accesorios y figuras de tus personajes favoritos en un solo lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${display.variable} ${body.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        <SessionExpiryListener />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
