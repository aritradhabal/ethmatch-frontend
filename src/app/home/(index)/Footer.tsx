"use client";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd, HeartPlus, Calendar, User } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";

const Footer = () => {
  const pathname = usePathname();

  const FooterItems = [
    { label: "Explore", icon: GalleryVerticalEnd, href: "/home" },
    { label: "Matches", icon: HeartPlus, href: "/home/match" },
    { label: "Events", icon: Calendar, href: "/home/events" },
    { label: "Profile", icon: User, href: "/home/profile" },
  ];

  return (
    <div className="w-screen flex justify-center items-center">
      <div className="inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-base ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0  disabled:pointer-events-none disabled:opacity-50 text-main-foreground border-2 border-border bg-[#F3F2F0] gap-x-2 py-3 px-4">
        <div className="flex gap-x-6 font-space-mono">
          {FooterItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                onClick={sendLightHapticFeedbackCommand}
                key={item.label}
                href={item.href}
                className="font-space-mono flex flex-col justify-center items-center gap-y-0.5 text-xs"
              >
                <item.icon />
                <p
                  className={`${
                    isActive
                      ? "text-slate-950 font-extrabold underline underline-offset-4 decoration-2 decoration"
                      : "text-slate-800 font-semibold"
                  }`}
                >
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
