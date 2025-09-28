"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SendHorizontal, Lock } from "lucide-react";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";
import { useSession } from "next-auth/react";

export default function MatchImageCard({
  url,
  contact,
}: {
  url: string;
  contact: string;
}) {
  const session = useSession();
  const [paid, setPaid] = useState(false);
  const sendPayment = async () => {
    sendLightHapticFeedbackCommand();
    const res = await fetch("/api/initiate-payment", {
      method: "POST",
    });
    const { id } = await res.json();

    const payload: PayCommandInput = {
      reference: id,
      to: "0xbcb60c70a4b3178bea91e8ad04e5ed73aa48a9c7",
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
        },
        {
          symbol: Tokens.USDC,
          token_amount: tokenToDecimals(5, Tokens.USDC).toString(),
        },
      ],
      description: "Pay and Lock In your relationship",
    };

    if (!MiniKit.isInstalled()) {
      return;
    }

    const { finalPayload } = await MiniKit.commandsAsync.pay(payload);
    console.log(finalPayload);
    if (finalPayload.status == "success") {
      const res = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload }),
      });

      const payment = await res.json();

      if (payment.success) {
        sendLightHapticFeedbackCommand();
        setPaid(true);
        const payload = {
          address: session.data?.user.id,
          name: "locked",
          username: session.data?.user.username,
          lookingFor: id,
          verified: "Orb",
        };

        try {
          const response = await fetch("/api/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const contentType = response.headers.get("content-type") || "";
          const body = contentType.includes("application/json")
            ? await response.json()
            : await response.text();

          console.log("Create status:", response.status, "body:", body);

          if (response.status === 200) return true;
          if (response.status === 400) return false; // Invalid user data
          if (response.status === 500) return false; // Failed to create node
          if (response.status === 502) return false; // Upstream unreachable (proxy)
          return response.ok;
        } catch (error) {
          console.error(error);
          return false;
        }
      }
    }
  };
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
          onClick={() => {
            sendLightHapticFeedbackCommand();
          }}
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
