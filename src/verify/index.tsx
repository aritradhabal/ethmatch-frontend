"use client";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";

export default async function Verify({
  verificationLevel,
  signal,
}: {
  verificationLevel: VerificationLevel;
  signal: string;
}): Promise<boolean> {
  const result = await MiniKit.commandsAsync.verify({
    action: "verify",
    verification_level: verificationLevel,
    signal: signal,
  });
  console.log(result.finalPayload);
  // Verify the proof
  const response = await fetch("/api/verify-proof", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payload: result.finalPayload,
      action: "verify",
      signal: signal,
    }),
  });

  const data = await response.json();
  console.log(data);
  if (data.verifyRes.success) {
    return true;
    // console.log("Verification successful, redirecting to home");
    // redirect("/home");
    // Normally you'd do something here since the user is verified
    // Here we'll just do nothing
  } else {
    return false;
    // console.log("Verification failed");
    // redirect("/");
  }
}
