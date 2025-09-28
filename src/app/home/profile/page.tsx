"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
import React from "react";

const page = () => {
  return (
    <div>
      <Input />
      <Button onClick={() => signOut({ redirectTo: "/" })}>Sign Out</Button>
    </div>
  );
};

export default page;

// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { signOut } from "next-auth/react";
// import React, { useEffect, useState } from "react";

// const page = () => {
//   const [secret, setSecret] = useState("");
//   const [link, setLink] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSecret = async () => {
//       try {
//         setLoading(true);
//         // NOTE: current route folder is "intiate-farcaster" (typo), so the endpoint is:
//         const res = await fetch("/api/intiate-farcaster", { method: "POST" });
//         if (!res.ok) throw new Error("Failed to generate secret");
//         const data = await res.json();
//         setSecret(data.id ?? "");
//       } catch (e: any) {
//         setError(e?.message || "Failed to generate secret key.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSecret();
//   }, []);

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     setError(null);
//     setSuccess(null);
//     try {
//       const res = await fetch("/api/verify-farcaster", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: secret, link }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         throw new Error(data?.error || "Failed to submit link.");
//       }
//       setSuccess("Link sent successfully.");
//     } catch (e: any) {
//       setError(e?.message || "Failed to submit link.");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 space-y-4">
//       <form onSubmit={onSubmit} className="space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="secret">Secret Key</Label>
//           <Input
//             id="secret"
//             value={loading ? "Generating..." : secret}
//             readOnly
//             disabled
//           />
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="link">Farcaster Post Link</Label>
//           <Input
//             id="link"
//             placeholder="Paste your Farcaster post link"
//             value={link}
//             onChange={(e) => setLink(e.target.value)}
//           />
//         </div>

//         {error ? <p className="text-sm text-red-500">{error}</p> : null}
//         {success ? <p className="text-sm text-green-600">{success}</p> : null}

//         <div className="flex items-center gap-2">
//           <Button type="submit" disabled={submitLoading || !secret || !link}>
//             {submitLoading ? "Submitting..." : "Submit"}
//           </Button>
//           <Button
//             type="button"
//             variant="match"
//             onClick={() => signOut({ redirectTo: "/" })}
//           >
//             Sign Out
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default page;
