import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Header } from "@/shared/ui/Header";
import { Footer } from "@/shared/ui/Footer";
import { CartPanel } from "@/features/cart/ui/CartPanel";
import { ContentWrapper } from "@/shared/ui/ContentWrapper";
import { TetrisBg } from "@/shared/ui/TetrisBg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant Ordering",
  description: "Frontend for menu and order flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} antialiased flex min-h-screen`}
      >
        <TetrisBg />
        <ContentWrapper>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ContentWrapper>
        <CartPanel />
      </body>
    </html>
  );
}
