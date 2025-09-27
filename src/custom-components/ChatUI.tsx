import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { SendIcon } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

export type ChatRole = "user" | "assistant";

// Updated Message interface to match the API structure
export interface Message {
  address: string;
  content: string;
  counter: number;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

interface Profile {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

interface ChatUIProps {
  title?: string;
  subtitle?: string;
  className?: string;
  initialMessages?: ChatMessage[];
  onSend?: (message: string) => Promise<string> | string | void;
  profiles?: Profile[];
  openchatbtn: any;
  setOpenChatbtn: any;
  addressTarget: string;
  myAddress: string;
}

export function ChatUI({
  title = "Chat",
  subtitle = "Ask anything and I'll help",
  className,
  initialMessages,
  onSend,
  profiles,
  openchatbtn,
  setOpenChatbtn,
  addressTarget,
  myAddress,
}: ChatUIProps) {
  const session = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>(
    initialMessages ?? [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Loading...",
      },
    ]
  );
  const [input, setInput] = useState("");

  const endRef = useRef<HTMLDivElement | null>(null);

  const people: any = profiles ?? [
    {
      id: "1",
      name: session.data?.user.name,
      initials: "AG",
      avatarUrl: "/placeholder.svg",
    },
  ];
  const [activeId, setActiveId] = useState<string>(people[0]?.id ?? "");
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  // Fetch messages from API

  const getMutualType = async (
    addressA: string,
    addressB: string,
    type: string
  ) => {
    if (!session) return;
    const payload = {
      addressA: addressA,
      addressB: addressB,
      type: type,
    };
    const res = await fetch("/api/get-mutual-type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    else {
      return res.json();
    }
  };

  useEffect(() => {
    const getMessagesData = async (address: string) => {
      if (!session.data?.user?.id) return;
      const payload = {
        address: addressTarget,
      };
      const res = await fetch("/api/get-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return false;
      else {
        return res.json();
      }
    };

    const fetchMessages = async () => {
      const msgs = await getMessagesData(session.data?.user.id as string);
      if (msgs && msgs.messages) {
        // Convert API messages to ChatMessage format
        const chatMessages: ChatMessage[] = msgs.messages.map(
          (msg: Message, index: number) => ({
            id: `msg-${msg.counter}-${index}`,
            role: "assistant" as ChatRole, // Messages from API are from other users
            content: msg.content,
          })
        );
        setMessages(chatMessages);
      }
    };

    if (session.data?.user?.id) {
      fetchMessages();
    }
    const getMututalTypeData = async () => {
      const like = await getMutualType(myAddress, addressTarget, "like");
      if (like) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    };
  }, [session]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simple demo response or external handler
    try {
      let reply: string | void = undefined;
      if (onSend) {
        reply = await onSend(trimmed);
      } else {
        reply = `You said: ${trimmed}`;
      }
      if (typeof reply === "string" && reply.length > 0) {
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {openchatbtn === true ? (
        <div
          className={cn(
            "mx-auto w-full overflow-hidden rounded-md border-1 border-black bg-rose-300/40 backdrop-blur-sm p-3 font-lexend flex flex-col gap-y-2 justify-center items-center",
            className
          )}
        >
          <div className="absolute top-3 right-3 cursor-pointer">
            <Image
              src="/icons/cross_chat.svg"
              height={100}
              width={100}
              alt="close chat"
              className="w-5 h-5 "
              onClick={() => setOpenChatbtn(!openchatbtn)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-hidden rounded-xs p-2">
            <button
              className={cn(
                "flex items-center gap-2 rounded-xs border-1 border-black px-2 py-1 cursor-pointer bg-amber-300 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] -rotate-2"
              )}
            >
              <Avatar className={cn("outline-1 h-8 w-8 bg-amber-200")}>
                <AvatarImage src={"p.avatarUrl"} alt={"avatar"} />

                <AvatarFallback className="text-xs font-bold text-foreground bg-amber-100">
                  A
                </AvatarFallback>
              </Avatar>
              <span className="whitespace-nowrap text-xs font-medium text-foreground px-1 rounded-sm truncate block max-w-35">
                {session.data?.user.username}
              </span>
            </button>
          </div>
          <div className="overflow-hidden rounded-[6px] border-1 border-black w-full">
            <ScrollArea className="h-[420px] max-h-[calc(100svh-12rem)] bg-rose-50 ">
              <ScrollArea
                className="h-[420px] max-h-[calc(100svh-12rem)] bg-rose-50 "
                style={{ willChange: "height", backfaceVisibility: "hidden" }}
              >
                <div className="space-y-3 py-4 px-3 max-w-full">
                  {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} />
                  ))}
                  <div ref={endRef} />
                </div>
              </ScrollArea>
            </ScrollArea>
          </div>
          <div className="w-full flex flex-row justify-center items-center rounded-[6px] border-1 bg-rose-50 overflow-hidden px-1">
            <Input
              disabled={!isAllowed}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border-0 h-[46px] w-full bg-rose-50 overflow-hidden"
            />
            <Button
              disabled={!isAllowed}
              type="button"
              variant="noShadow"
              onClick={handleSend}
              className="border-1 h-10 px-2 cursor-pointer"
            >
              <SendIcon />
              Send
            </Button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "max-w-full flex items-start gap-3",
        isUser && "flex-row-reverse"
      )}
    >
      <Avatar className="outline-1 mt-0.5 h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs font-bold text-foreground">
          {isUser ? "U" : "A"}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[78%] rounded-sm border-1 px-3 py-2 text-xs leading-relaxed flex flex-row flex-wrap",
          isUser
            ? "border-black bg-card text-foreground"
            : "border-black bg-card text-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

export default ChatUI;
