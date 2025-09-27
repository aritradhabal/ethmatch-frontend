"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, Icon } from "lucide-react";

import { starNorth } from "@lucide/lab";
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import VerifyProof from "@/verify";
import { VerificationLevel } from "@worldcoin/minikit-js";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ProfileModal() {
  const session = useSession();
  const router = useRouter();
  const preferences = [
    "Music",
    "Tech",
    "Art",
    "Food",
    "Books",
    "Movies",
    "TV",
    "Games",
  ];
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [gender, setGender] = useState<string>();
  const [lookingFor, setLookingFor] = useState<string>();
  const [profilePicture, setProfilePicture] = useState<string>();
  const [name, setName] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [verification_level, setVerificationLevel] = useState<string>("Orb");
  const [isPending, setIsPending] = useState<boolean>(false);

  const handleFormSubmit = async () => {
    setIsPending(true);
    // console.log("Form submitting...");
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const payload = {
      address: session.data?.user.id,
      name: name,
      username: username,
      gender: gender,
      lookingFor: lookingFor,
      profilePicture: profilePicture,
      preferences: selectedPreferences,
      verified: "Orb",
    };

    try {
      // console.log("Payload:", payload);
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

      setIsPending(false);
      if (response.status === 200) return true;
      if (response.status === 400) return false; // Invalid user data
      if (response.status === 500) return false; // Failed to create node
      if (response.status === 502) return false; // Upstream unreachable (proxy)
      return response.ok;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            onClick={sendLightHapticFeedbackCommand}
            className="bg-[#F3F2F0] text-center cursor-pointer h-13 font-lexend text-sm md:text-base flex flex-row justify-center items-center flex-wrap"
          >
            <Icon iconNode={starNorth} />
            <p>Continue Setting up Your Profile</p>
          </Button>
        </DialogTrigger>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-sm bg-gradient-to-b from-emerald-100 to-slate-50"
        >
          <DialogHeader>
            <DialogTitle>Complete Creating Your profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click verify when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 grid-cols-1 place-content-center">
            <div className="flex gap-2 justify-center items-center">
              <div className="basis-1/2 min-w-0">
                <Label htmlFor="name-1">Name</Label>
                <Input
                  className=""
                  id="name-1"
                  name="name"
                  defaultValue={(session?.data?.user?.username ?? "").replace(
                    /\..*$/,
                    ""
                  )}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="basis-1/2 min-w-0">
                <Label htmlFor="username-1">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  defaultValue={session?.data?.user?.username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="basis-1/2 min-w-0">
                <Label htmlFor="gender">Gender</Label>
                <Select disabled={false} onValueChange={setGender}>
                  <SelectTrigger className="w-full h-11 bg-secondary-background selection:bg-secondary-background selection:text-main-foreground">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-emerald-300 border-1">
                    <SelectGroup>
                      <SelectItem className="border-1" value="male">
                        Male
                      </SelectItem>
                      <SelectItem className="border-1" value="female">
                        Female
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="basis-1/2 min-w-0">
                <Label htmlFor="gender_pref">Looking For</Label>
                <Select disabled={false} onValueChange={setLookingFor}>
                  <SelectTrigger className="w-full h-11 bg-secondary-background selection:bg-emerald-100 selection:text-main-foreground">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-emerald-300 border-1">
                    <SelectGroup>
                      <SelectItem className="border-1" value="male">
                        Male
                      </SelectItem>
                      <SelectItem className="border-1" value="female">
                        Female
                      </SelectItem>
                      <SelectItem className="border-1" value="both">
                        Both
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>{" "}
            {/* TODO: PROFILE PHOTO */}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" type="file" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="perfs">Perferences</Label>
              <div className="flex items-center flex-wrap gap-1.5 max-w-sm">
                {preferences.map((preference) => {
                  const isSelected = selectedPreferences.includes(preference);
                  return (
                    <Badge
                      key={preference}
                      variant="neutral"
                      className={
                        isSelected
                          ? "bg-emerald-300 border-1 font-lexend font-semibold"
                          : "border-1 font-lexend"
                      }
                      onClick={() =>
                        setSelectedPreferences((prev) =>
                          prev.includes(preference)
                            ? prev.filter((p) => p !== preference)
                            : [...prev, preference]
                        )
                      }
                    >
                      {isSelected ? (
                        <>
                          <Check />
                          {preference}
                        </>
                      ) : (
                        preference
                      )}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant={"match"}
                className="bg-red-400"
                onClick={() => {
                  signOut({ redirectTo: "/" });
                }}
              >
                <p className="text-white">Cancel</p>
              </Button>
            </DialogClose>
            <Button
              variant={"match"}
              type="submit"
              className="bg-emerald-300"
              onClick={async () => {
                sendLightHapticFeedbackCommand();
                const verified = await VerifyProof({
                  verificationLevel: VerificationLevel.Orb,
                  signal: session.data?.user.id ?? "",
                });
                console.log("Verified:", verified);
                if (verified) {
                  const success = await handleFormSubmit();
                  if (success) {
                    router.push("/home");
                  } else {
                    router.push("/");
                  }
                } else {
                  router.push("/");
                }
              }}
            >
              {isPending ? "Creating Profile..." : "Verify and Start Exploring"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
