"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { MessagesSquare } from "lucide-react";

const loading = () => {
  return (
    <div className="pt-12 w-screen flex flex-col justify-center items-center overflow-clip gap-y-7 animate-pulse">
      <div className="grid h-auto place-items-center">
        <div
          className="p-2.5 md:p-5 bg-amber-300 border-2 border-black 
          grid grid-rows-[1fr_3.75rem] place-content-center gap-y-2
          rounded-xs overflow-hidden w-60 md:w-72 xl:w-87"
        >
          <div className="relative h-72 w-60 md:h-96 md:w-72 xl:h-110 xl:w-87 bg-amber-100 rounded-sm" />
          <div className="w-60 h-16 bg-amber-100 rounded-sm" />
        </div>
      </div>

      {/* Button */}
      <div className="py-2">
        <Button
          disabled
          variant="match"
          className="bg-lime-200 text-black font-space-mono-bold z-50 border-2 cursor-default"
        >
          <MessagesSquare /> Join the Chat
        </Button>
      </div>
    </div>
  );
};

export default loading;
