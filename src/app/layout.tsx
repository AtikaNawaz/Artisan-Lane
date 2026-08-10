import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artisanlane.pk"),
  title: {
    default: "Artisan Lane",
    template: "%s | Artisan Lane",
  },
  description:
    "Artisan Lane is Pakistan’s boutique marketplace for handmade ceramics, textiles, jewelry, woodwork, and more connecting local artisans with buyers who value authenticity.",
  openGraph: {
    title: "Artisan Lane",
    description: "Handmade with heart, delivered with care.",
    locale: "en_PK",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable} h-full`}>
      <body className="texture-warm flex min-h-full flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
