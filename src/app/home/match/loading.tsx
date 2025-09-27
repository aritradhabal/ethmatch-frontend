"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const Loading = () => {
  return (
    <div className="pt-11 w-screen flex flex-col justify-center items-center gap-y-5">
      {/* Buttons skeleton */}
      <div className="w-screen flex flex-row justify-center items-center gap-x-5">
        <div className="w-[150px] h-10 -rotate-1 bg-gradient-to-tl from-amber-300 via-amber-100 to-amber-400 rounded-md animate-pulse" />
        <div className="w-[150px] h-10 rotate-1 bg-gradient-to-tr from-amber-400 via-amber-100 to-amber-300 rounded-md animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="w-screen max-h-[calc(100vh-16.5rem)] px-5 py-2 grid grid-cols-2 gap-x-4 gap-y-4 overflow-y-scroll">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="border-2 shadow-shadow-match w-full h-fit gap-2 py-3 
                       bg-gradient-to-b from-lime-100 via-lime-50 to-lime-100 
                       animate-pulse"
          >
            <CardContent className="px-2 flex justify-center items-center">
              <div
                className="relative h-48 w-40 md:h-96 md:w-72 xl:h-110 xl:w-87 
                              rounded-sm bg-slate-100"
              />
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center gap-y-2.5">
              <div className="bg-lime-300 w-[120px] h-7 rounded-md" />
              <div className="bg-lime-300 w-[120px] h-7 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Loading;
