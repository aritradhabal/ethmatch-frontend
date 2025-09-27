"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  HeartPlus,
  SendHorizontal,
  LockKeyholeOpen,
  Lock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";

const Match = () => {
  const matches = [];
  const url =
    "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="pt-11 w-screen flex flex-col justify-center items-center gap-y-5">
      <div className="w-screen flex flex-row justify-center items-center gap-x-5 ">
        <Button
          onClick={sendLightHapticFeedbackCommand}
          variant={"match"}
          className="w-[150px] -rotate-1 focus:rotate-0 bg-gradient-to-tl from-amber-300 via-amber-100 to-amber-400 focus:bg-gradient-to-tr focus:from-amber-400 focus:via-amber-100 focus:to-amber-300 transition-all duration-350 text-slate-900 font-space-mono-bold tracking-tight text-xs"
        >
          <Send />
          Hearts Sent
        </Button>
        <Button
          onClick={sendLightHapticFeedbackCommand}
          variant={"match"}
          className="w-[150px] rotate-1 focus:rotate-0 bg-gradient-to-tr from-amber-400 via-amber-100 to-amber-300 focus:bg-gradient-to-tl focus:from-amber-300 focus:via-amber-100 focus:to-amber-400 transition-all duration-350 font-space-mono-bold tracking-tight text-xs"
        >
          <HeartPlus />
          Hearts Received
        </Button>
      </div>
      <div className="w-screen max-h-[calc(100vh-16.5rem)] px-5 py-2 grid grid-cols-2 gap-x-4 gap-y-4 overflow-y-scroll">
        <MatchImageCard url={url} />
        <MatchImageCard url={url} />
        <MatchImageCard url={url} />
        <MatchImageCard url={url} />
        <MatchImageCard url={url} />
        <MatchImageCard url={url} />
        <MatchImageCard url={url} />
      </div>
    </div>
  );
};

export default Match;

const MatchImageCard = ({ url }: { url: string }) => (
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
        onClick={sendLightHapticFeedbackCommand}
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
