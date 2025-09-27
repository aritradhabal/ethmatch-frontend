"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import Image from "next/image";
import { MessagesSquare } from "lucide-react";
import { sendLightHapticFeedbackCommand } from "@/utils/haptics";
import ProfileDetails from "@/custom-components/ProfileDetails";
import { cn } from "@/lib/utils";
import ChatUI from "@/custom-components/ChatUI";
import { useSession } from "next-auth/react";

const Home = () => {
  const session = useSession();
  // const [cards, setCards] = useState(rawCardData);
  const [cards, setCards] = useState<any[]>([]);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [openchatbtn, setOpenChatbtn] = useState(false);
  const sendLike = async (likedAddress: string) => {
    if (!session) return;
    const payload = {
      sourceNodeId: "node_" + session.data?.user.id,
      targetNodeId: "node_" + likedAddress,
      type: "like",
      properties: JSON.stringify({}),
    };
    const res = await fetch("/api/create-relation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    else {
      return true;
    }
  };
  const sendDislike = async (likedAddress: string) => {
    if (!session) return;
    const payload = {
      sourceNodeId: "node_" + session.data?.user.id,
      targetNodeId: "node_" + likedAddress,
      type: "dislike",
      properties: JSON.stringify({}),
    };
    const res = await fetch("/api/create-relation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    else {
      return true;
    }
  };
  const getRecommendations = async (address: string) => {
    if (!session) return;
    const payload = {
      address: address,
    };

    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    else {
      return res.json();
    }
  };
  const [cardsAPI, setCardsAPI] = useState<any>();
  useEffect(() => {
    const getRecommendationsData = async () => {
      const recommendations = await getRecommendations(
        session.data?.user.id as string
      );
      setCardsAPI(recommendations);
    };
    getRecommendationsData();
  }, [session]);

  useEffect(() => {
    if (!cardsAPI?.recommendations) return;

    const CardData_ = cardsAPI.recommendations.map((rec: any, idx: number) => {
      const p = rec.properties ?? {};
      return {
        id: idx,
        address: p.address ?? "",
        username: p.username ?? p.name ?? "",
        lookingFor: p.lookingFor ?? "Both",
        verified: p.verified ?? "Device",
        name: p.name ?? "",
        url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop",
        gender: p.gender ?? "",
        preferences: Array.isArray(p.preferences) ? p.preferences : [],
        age: typeof p.age === "number" ? p.age : 0,
        city: p.city ?? "",
        messages: Array.isArray(p.messages) ? p.messages : [],
      };
    });

    setCards(CardData_);
  }, [cardsAPI]);

  return (
    <div className="pt-12 w-screen flex flex-col justify-center items-center overflow-clip gap-y-7">
      <div className=" grid h-auto place-items-center">
        {cards.map((card) => {
          return (
            <Card
              key={card.id}
              cards={cards}
              setCards={setCards}
              setSelectedCard={setSelectedCard}
              {...card}
              sendLike={sendLike}
              sendDislike={sendDislike}
              address={card.address}
              verified={card.verified}
              name={card.name}
              username={card.username}
              lookingFor={card.lookingFor}
              preferences={card.preferences}
              age={card.age}
              city={card.city}
            />
          );
        })}
      </div>
      <div className="py-2">
        <Button
          onClick={() => {
            sendLightHapticFeedbackCommand();
            setOpenChatbtn(!openchatbtn);
          }}
          variant="match"
          className=" bg-lime-300 font-space-mono-bold z-50 border-2 cursor-pointer"
        >
          <MessagesSquare /> Join the Chat
        </Button>
        {openchatbtn && (
          <div className={cn("fixed inset-0 z-50 grid place-items-center p-4")}>
            <div className="w-full max-w-lg sm:max-w-xl">
              <ChatUI
                addressTarget={cards[cards.length - 1].address}
                myAddress={session.data?.user.id as string}
                openchatbtn={openchatbtn}
                setOpenChatbtn={setOpenChatbtn}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

const Card = ({
  id,
  url,
  setCards,
  cards,
  setSelectedCard,
  sendLike,
  sendDislike,
  address,
  verified,
  name,
  username,
  lookingFor,
  preferences,
  age,
  city,
}: {
  id: number;
  url: string;
  cards: any;
  setCards: any;
  setSelectedCard: any;
  sendLike: any;
  sendDislike: any;
  address: any;
  verified: any;
  name: any;
  username: any;
  lookingFor: any;
  preferences: any;
  age: any;
  city: any;
}) => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const rotateRaw = useTransform(x, [-150, 150], [-10, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const heartOpacity = useTransform(x, (value) => {
    if (value <= 1.5) {
      return 0;
    }
    if (value > 1.5) {
      return 1;
    }
  });
  const crossOpacity = useTransform(x, (value) => {
    if (value < -1.5) {
      return 1;
    } else return 0;
  });

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    var offset = 0;
    if (isFront) {
      offset = 0;
    } else {
      offset = -1.5;
    }
    return `${rotateRaw.get() + offset}deg`;
  });

  const index = cards.findIndex((card: any) => card.id === id);

  const handleDragEnd = async () => {
    setIsDragging(false);
    if (x.get() > 50) {
      setCards((pv: any) => pv.filter((v: any) => v.id !== id));
      sendLightHapticFeedbackCommand();
      await sendLike(cards[cards.length - 1].address);
    } else if (x.get() < -80) {
      setCards((pv: any) => pv.filter((v: any) => v.id !== id));
      sendLightHapticFeedbackCommand();
      await sendDislike(cards[cards.length - 1].address);
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  };

  const handleClick = () => {
    if (!isDragging && isFront) {
      setSelectedCard({ id, url });
    }
  };

  const cardColors = [
    "#f472b6", // pink-400
    "#22d3ee", // cyan-400
    "#a3e635", // lime-400
    "#fb923c", // orange-400
    "#c084fc", // purple-400
    "#facc15", // yellow-400
    "#f87171", // red-400
    "#60a5fa", // blue-400
  ];

  const cardColor = cardColors[id % cardColors.length];

  return (
    <motion.div
      className={`p-2.5 md:p-5 bg-amber-300 ${isFront ? "matching-shadows" : ""}
       ${
         isFront
           ? "border-[2px] md:border-[2.5px] border-black"
           : "border-1 border-slate-800"
       }
       grid grid-rows-[1fr_3.75rem] place-content-center gap-y-2 origin-right rounded-xs overflow-hidden transform group hover:cursor-grab active:cursor-grabbing`}
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        zIndex: index + 1,
      }}
      initial={false}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: -200,
        right: 200,
      }}
      transition={{
        rotate: { duration: 0.25, ease: "backOut" },
      }}
      dragElastic={0.2}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <motion.div
        className={`relative h-72 w-60 md:h-96 md:w-72 xl:h-110 xl:w-87 rounded-sm overflow-hidden transform group hover:cursor-grab active:cursor-grabbing`}
      >
        <Image
          src={url}
          alt="Card image"
          fill
          sizes="(max-width: 1280px) 288px, 348px"
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
          priority={isFront}
          loading={isFront ? "eager" : "lazy"}
          fetchPriority={isFront ? "high" : "auto"}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-38 h-38 z-10"
          style={{
            opacity: crossOpacity,
          }}
          transition={{
            opacity: { duration: 0.25, ease: "backOut" },
          }}
        >
          <Image
            src={"/like-dislike/cross.svg"}
            alt="heart"
            width={100}
            height={100}
            className="w-full h-full"
            draggable={false}
          />
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 z-10"
          style={{
            opacity: heartOpacity,
          }}
          transition={{
            opacity: { duration: 0.05, ease: "easeOut" },
          }}
        >
          <Image
            src={"/like-dislike/heart.svg"}
            alt="heart"
            width={100}
            height={100}
            className="w-full h-full"
            draggable={false}
          />
        </motion.div>
      </motion.div>
      <div className="w-60 bg-amber-100 rounded-sm overflow-y-scroll">
        <ProfileDetails
          userProfile={{
            city,
            verified,
            name,
            username,
            lookingFor,
            preferences,
            age,
          }}
        />
      </div>
    </motion.div>
  );
};

type Card = {
  id: number;
  url: string;
};

const cardData: Card[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 13,
    url: "https://images.unsplash.com/photo-1758315716325-d2c7c0eb9659?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
