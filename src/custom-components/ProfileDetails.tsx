import { Badge } from "@/components/ui/badge";
import {
  BadgeCheck,
  UserRound,
  Activity,
  MapPin,
  Asterisk,
  ThumbsUp,
  AudioLines,
  Twitter,
} from "lucide-react";
import React from "react";

interface UserProfile {
  address: string;
  verified: "Orb" | "Device";
  name: string;
  username: string;

  lookingFor: "Male" | "Female" | "Both";
  preferences: string[];
  age: number;
  city: string;
  spotify?: string;
  twitter?: string;
}

const ProfileDetails = () => {
  const userProfile: UserProfile = {
    address: "0x1234567890abcdef",
    verified: "Orb",
    name: "John Doe",
    username: "Ankitadhabal",

    lookingFor: "Female",
    preferences: ["Music", "Travel", "Tech"],
    age: 28,
    city: "New York",
    spotify: "link",
    twitter: "link",
  };

  return (
    <div className="p-1.5 font-lexend text-xs tracking-tight flex gap-x-1 flex-wrap items-center gap-y-1">
      <Badge variant="profile" className="border-[0.7px]">
        <UserRound />
        <p className="">{userProfile.username}</p>
      </Badge>
      <Badge variant="profile" className="border-[0.7px]">
        <Activity />
        <p className="">{userProfile.age}</p>
      </Badge>
      <Badge
        variant="profile"
        className="px-1 border-[0.7px] flex items-center justify-center"
      >
        <BadgeCheck />
        <p className="">{userProfile.verified}</p>
      </Badge>
      <Badge variant="profile" className="border-[0.7px]">
        <MapPin />
        <p className="">{userProfile.city}</p>
      </Badge>
      <Badge variant="profile" className="border-[0.7px]">
        <ThumbsUp />
        <p className="">{userProfile.preferences.join(", ")}</p>
      </Badge>

      <Badge
        asChild
        variant="profile"
        className="border-[0.7px] cursor-pointer"
      >
        <a href={userProfile.spotify} target="_blank" rel="noopener noreferrer">
          <AudioLines />
          <p className="">Spotify</p>
        </a>
      </Badge>
      <Badge
        asChild
        variant="profile"
        className="border-[0.7px] cursor-pointer"
      >
        <a href={userProfile.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter />
          <p className="">Farcaster</p>
        </a>
      </Badge>
    </div>
  );
};

export default ProfileDetails;
