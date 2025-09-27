"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SendHorizontal, Lock } from "lucide-react";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";

export default function MatchImageCard({
  url,
  contact,
}: {
  url: string;
  contact: string;
}) {
  const handleMessage = () => {
    sendLightHapticFeedbackCommand();
    if (!contact) return;
    const href = `https://t.me/${contact}`;
    window.open(href, "_blank", "noopener,noreferrer");
  };
  return (
    <Card className="border-2 shadow-shadow-match w-full h-fit gap-2 py-3 bg-gradient-to-b from-lime-100 via-lime-50 to-lime-100">
      <CardContent className="px-2 flex justify-center items-center">
        <div className=" relative h-48 w-40 md:h-96 md:w-72 xl:h-110 xl:w-87 rounded-sm overflow-hidden ">
          <Image
            src={url}
            alt="Card image"
            fill
            sizes="(min-width: 1280px) 348px, (min-width: 768px) 288px, 240px"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-center items-center gap-y-2.5">
        <Button
          onClick={handleMessage}
          variant={"match"}
          className="bg-lime-300 w-[120px] font-lexend tracking-normal text-xs flex flex-row justify-center items-center gap-x-1.5"
        >
          Message
          <SendHorizontal />
        </Button>
        <Button
          onClick={sendLightHapticFeedbackCommand}
          variant={"match"}
          className="bg-lime-300 w-[120px] font-lexend tracking-normal text-xs flex flex-row justify-center items-center gap-x-1.5"
        >
          Stake & Lock
          <Lock />
        </Button>
      </CardFooter>
    </Card>
  );
}
