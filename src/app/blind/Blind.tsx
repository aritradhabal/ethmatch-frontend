"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";

const Blind = () => {
  const [price, setPrice] = useState(0);
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    const fetchPrice = async () => {
      const res = await fetch("/api/get-price");
      const data = await res.json();
      setPrice(data.WLD_USD);
    };
    fetchPrice();
  }, []);
  const [fiat, setFiat] = useState(false);
  const handleclick = () => {
    sendLightHapticFeedbackCommand();
    setFiat((prev) => !prev);
  };
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
      description: "Pay for a cool Blind Date",
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
      }
    }
  };

  return (
    <div className="h-screen pt-16">
      <div className="pt-20 w-full overflow-hidden sm:hidden flex items-center justify-center px-4">
        <Card className="w-full max-w-[420px]">
          <CardHeader className="gap-2">
            <CardTitle className="text-3xl font-space-mono-bold tracking-tight">
              Blind Date
            </CardTitle>
            <CardDescription className="">
              Remove your worries and live cheerfully. Pay Now to join today.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="rounded-base border-2 border-border bg-secondary-background shadow-shadow px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70 font-space-mono">
                  Pay-per Date
                </span>
                <span
                  onClick={handleclick}
                  className="text-2xl font-heading font-space-mono-bold"
                >
                  {fiat ? "5.0" + " USD" : price + " WLD"}
                </span>
              </div>
            </div>

            <ul className="text-sm list-disc list-inside space-y-1 font-lexend">
              <li>Faster Matching</li>
              <li>Boosted priority for 24h</li>
              <li>Safety with the peace of mind</li>
            </ul>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={sendPayment}
              className="bg-emerald-300 w-full font-lexend px-2"
              size="lg"
            >
              {paid ? (
                <p className="text-xs font-lexend tracking-tight">
                  You are done! Check your Matches frequently...
                </p>
              ) : (
                <p className="text-md font-lexend tracking-tight">Pay Now</p>
              )}
            </Button>
            <p className="text-xs text-foreground/60 text-center font-lexend">
              By paying, you agree to the blind-date rules. Non‑refundable.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Blind;
