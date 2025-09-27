import React from "react";
import Footer from "@/custom-components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home 🧡 | ETHMatch",
  description: "Home 🧡 | ETHMatch",
  icons: {
    icon: "/logos/ETHMatch.png",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen pt-16">
      {children}
      <div className="fixed bottom-5 inset-x-0 flex justify-center items-center">
        <Footer />
      </div>
    </div>
  );
}
