import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Mono, Lexend } from "next/font/google";
import "./globals.css";
import Header from "@/custom-components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ETHMatch ❤️",
  description: "ETHMatch ❤️",
  icons: {
    icon: "/logos/world.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${lexend.variable} bg-rose-400 antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
