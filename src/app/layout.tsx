import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Mono, Lexend } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import ClientProviders from "@/Providers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${lexend.variable} bg-rose-400 antialiased`}
      >
        <div className="min-h-screen w-full relative">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: `
    radial-gradient(ellipse 80% 60% at 70% 20%, oklch(71.2% 0.194 13.428), transparent 68%),
    radial-gradient(ellipse 70% 60% at 20% 80%, oklch(71.2% 0.194 13.428), transparent 68%),
    radial-gradient(ellipse 60% 50% at 60% 65%, oklch(71.2% 0.194 13.428), transparent 68%),
    radial-gradient(ellipse 65% 40% at 50% 60%, oklch(71.2% 0.194 13.428), transparent 68%),
    linear-gradient(180deg, oklch(89.2% 0.058 10.001) 0%, #fde2ea 100%)
  `,
            }}
          />
          <ClientProviders session={session}>{children}</ClientProviders>
        </div>
      </body>
    </html>
  );
}
