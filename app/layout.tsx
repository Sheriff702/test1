import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartSheet } from "@/components/cart/CartSheet";
import { PageTransition } from "@/components/layout/PageTransition";
import { PreferencesProvider } from "@/lib/preferences";
import { isAuthed } from "@/lib/auth";
import { getAllOverrides } from "@/lib/content";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MARES — Urban Uniform",
  description:
    "MARES is a streetwear label building the urban uniform. Technical outerwear, heavyweight basics, considered accessories.",
  openGraph: {
    title: "MARES — Urban Uniform",
    description: "Streetwear, engineered.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminAuthed, overrides] = await Promise.all([
    isAuthed(),
    getAllOverrides(),
  ]);
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-ink text-cream font-sans grain antialiased">
        <PreferencesProvider overrides={overrides}>
          <SmoothScroll>
            <CustomCursor />
            <Nav adminAuthed={adminAuthed} />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer />
            <CartSheet />
          </SmoothScroll>
        </PreferencesProvider>
      </body>
    </html>
  );
}
