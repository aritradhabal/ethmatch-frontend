"use client";
import Header from "@/custom-components/Header";
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ErudaProvider = dynamic(
  () => import("@/Providers/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null; // Use the appropriate type for session from next-auth
}

export default function ClientProviders({
  children,
  session,
}: ClientProvidersProps) {
  return (
    <MiniKitProvider
      props={{
        appId: process.env.NEXT_PUBLIC_APP_ID as string,
      }}
    >
      <Header />
      <SessionProvider session={session}>
        <ErudaProvider>{children}</ErudaProvider>
      </SessionProvider>
    </MiniKitProvider>
  );
}
