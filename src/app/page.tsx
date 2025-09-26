"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  sendHeavyHapticFeedbackCommand,
  sendLightHapticFeedbackCommand,
  sendMediumHapticFeedbackCommand,
} from "@/utils/haptics";

const images = [
  { src: "/couples/couple1.png", alt: "couple1", bg: "bg-pink-400" },
  { src: "/couples/couple2.png", alt: "couple2", bg: "bg-fuchsia-400" },
  { src: "/couples/couple3.png", alt: "couple3", bg: "bg-rose-400" },
];
const items: string[] = [
  "Friends",
  "Soulmates",
  "Partners",
  "Dates",
  "Friends",
];

const LandingPage: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const { src, alt } = images[index];

  return (
    <div className="h-screen py-16 sm:py-20 break-words">
      <div className="pt-13 pb-8 px-10 md:py-14 md:px-10 xl:p-18 2xl:p-28 grid grid-rows-[1fr_max(100px,1fr)] gap-y-8 xl:gap-y-20 ">
        <div className="grid grid-cols-1 xl:grid-cols-[500px_1fr] 2xl:grid-cols-[1fr_1fr] items-center gap-x-8 2xl:gap-x-14 gap-y-10 place-items-center">
          <Image
            src={src}
            alt={alt}
            width={200}
            height={200}
            priority={index === 0}
            className="place-self-center xl:place-self-end xl:self-center z-2 hover:cursor-none about-shape bg-emerald-300"
          />

          <div className="place-self-center 2xl:place-self-start 2xl:self-center grid gap-y-8">
            <div className="flex flex-row flex-wrap justify-center items-center max-w-none 2xl:max-w-2xl gap-x-2.5 gap-y-3.5 font-lexend font-normal text-2xl md:text-6xl leading-none text-pink-200">
              <p className="tracking-tight">
                The{" "}
                <span className="text-rose-100 font-bold tracking-tighter">
                  app{" "}
                </span>
                that{" "}
                <span className="text-rose-100 font-bold tracking-tighter">
                  finds{" "}
                </span>
              </p>
              <div className=" hover:cursor-none font-space-mono-bold about-shape-2 h-10 md:h-16 leading-none w-35 md:w-86 overflow-hidden text-center bg-amber-300 text-black">
                <div className="vertical-marquee flex flex-col items-center justify-center">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="h-8 md:h-14 flex items-center justify-center"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <p className="tracking-tight">
                across the{" "}
                <span className="text-rose-100 font-bold tracking-tighter">
                  world
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 grid grid-cols-1 gap-x-10 gap-y-4 place-content-center">
        <CTAButton />
      </div>
    </div>
  );
};

const CTAButton: React.FC = () => {
  const router = useRouter();
  const handleClick = async () => {
    sendLightHapticFeedbackCommand();
    router.push("/home");
  };
  return (
    <div className="flex justify-center items-center">
      <Button
        onClick={handleClick}
        className="bg-[#F3F2F0] text-slate-950 px-10 h-13 font-lexend text-sm flex justify-center items-center gap-x-2"
      >
        <Image src="/logos/world.png" alt="world" height={25} width={25} />
        <p className="text-md">Explore the new world</p>
      </Button>
    </div>
  );
};

export default LandingPage;
