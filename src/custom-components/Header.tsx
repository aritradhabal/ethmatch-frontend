"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  return (
    <div className="w-screen fixed top-5 px-5 md:px-20 xl:px-50 2xl:px-60 h-20 flex justify-center items-center z-10">
      <div className="w-full px-3 md:px-10 flex justify-center md:justify-between items-center h-20 md:bg-amber-300 md:border-[2.5px] border-[var(--primary_)]">
        {pathname === "/" && (
          <Link href="/" className="logo-box cursor-pointer">
            <p className="logo font-space-mono-bold text-3xl md:text-2xl">
              ETH MATCH
            </p>
          </Link>
        )}

        {pathname !== "/" && (
          <Link href="/blind" className="logo-box-1 cursor-pointer">
            <p className="logo font-space-mono-bold text-2xl">Blinds+</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
