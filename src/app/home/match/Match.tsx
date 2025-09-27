"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, HeartPlus } from "lucide-react";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";
import MatchImageCard from "@/custom-components/MatchImageCard";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import LikeImageCard from "@/custom-components/LikeImageCard";
import ReceiveImageCard from "@/custom-components/ReceiveImageCard";

const Match = () => {
  const session = useSession();

  const getMatches = async (address: string) => {
    if (!session) return;
    const payload = {
      address: address,
    };
    const res = await fetch("/api/get-matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    else {
      return res.json();
    }
  };
  const getLikesSent = async (address: string) => {
    if (!session) return;
    const payload = {
      sourceNodeId: "node_" + address,
      type: "like",
    };

    const res = await fetch("/api/likes-sent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return false;
    else {
      return res.json();
    }
  };

  const getLikesReceived = async (address: string) => {
    if (!session) return;
    const payload = {
      sourceNodeId: "node_" + address,
      type: "like",
    };

    const res = await fetch("/api/likes-received", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return false;
    else {
      return res.json();
    }
  };

  const [matches, setMatches] = useState<any>();
  const [likesSentData, setLikesSentData] = useState<any>();
  const [likesReceivedData, setLikesReceivedData] = useState<any>();
  const [likesSent, setLikesSent] = useState(false);
  const [likesReceived, setLikesReceived] = useState(false);

  useEffect(() => {
    const getMatchesData = async () => {
      if (!session) return;
      const data = await getMatches(session.data?.user.id as string);
      setMatches(data);
    };
    getMatchesData();
  }, [session]);

  const LikesSent = async () => {
    if (!session) return;
    const response = await getLikesSent(session.data?.user.id as string);
    const likesSentData_ = response.relationships;
    setLikesSentData(likesSentData_);
  };
  const LikesReceived = async () => {
    if (!session) return;
    const response = await getLikesReceived(session.data?.user.id as string);
    const likesReceivedData_ = response.relationships;
    setLikesReceivedData(likesReceivedData_);
  };

  const url =
    "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const matchList = Array.isArray(matches?.match) ? matches.match : [];

  return (
    <div className="pt-11 w-screen flex flex-col justify-center items-center gap-y-5">
      <div className="w-screen flex flex-row justify-center items-center gap-x-5 ">
        <Button
          onClick={() => {
            sendLightHapticFeedbackCommand;
            setLikesReceived(false);
            setLikesSent((prev: boolean) => !prev);
            LikesSent();
          }}
          variant={"match"}
          className="w-[150px] bg-gradient-to-tl from-amber-300 via-amber-100 to-amber-400 focus:bg-gradient-to-tr focus:from-amber-400 focus:via-amber-100 focus:to-amber-300 transition-all duration-350 text-slate-900 font-space-mono-bold tracking-tight text-xs"
        >
          <Send />
          Hearts Sent
        </Button>
        <Button
          onClick={() => {
            sendLightHapticFeedbackCommand;
            setLikesSent(false);
            setLikesReceived((prev) => !prev);
            LikesReceived();
          }}
          variant={"match"}
          className="w-[150px] bg-gradient-to-tr from-amber-400 via-amber-100 to-amber-300 focus:bg-gradient-to-tl focus:from-amber-300 focus:via-amber-100 focus:to-amber-400 transition-all duration-350 font-space-mono-bold tracking-tight text-xs"
        >
          <HeartPlus />
          Hearts Received
        </Button>
      </div>
      <div className="w-screen max-h-[calc(100vh-16.5rem)] px-5 py-2 grid grid-cols-2 gap-x-4 gap-y-4 overflow-y-scroll">
        {likesSent
          ? likesSentData?.map((m: any, i: number) => (
              <LikeImageCard key={i} url={url} id={m.targetId} />
            ))
          : likesReceived
          ? likesReceivedData?.map((m: any, i: number) => (
              <ReceiveImageCard
                key={i}
                url={url}
                id={m.sourceId}
                contact={m.contact}
              />
            ))
          : matchList.map((m: any, i: number) => (
              <MatchImageCard
                key={m.id}
                url={url}
                contact={m.properties.contact}
              />
            ))}
      </div>
    </div>
  );
};

export default Match;
