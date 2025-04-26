"use client";

import { useState, useCallback, useRef } from "react";
import { devilkingsScenario } from "@/ai/flows/devilkings-scenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, Send, Bot, User } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleAsk = useCallback(async () => {
    if (!question.trim()) {
      toast({ title: "Error", description: "Please enter a question." });
      return;
    }

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuestion("");

    try {
      const result = await devilkingsScenario({ question });
      const botMessage = { sender: "bot", text: result.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to get response: ${error.message}`,
      });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [question, toast]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-green-400 p-6 font-mono overflow-hidden">
      <header className="text-center mb-8 animate-pulse">
        <h1 className="text-5xl font-extrabold tracking-widest text-green-500 drop-shadow-lg">
          C3L1KD GPT
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Strictly for <span className="text-white">educational use</span> only.
        </p>
      </header>

      <ScrollArea className="h-[70vh] p-4 mb-6 rounded-lg border border-green-700/30 bg-black/30 shadow-inner">
        <div className="flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-xl shadow-md 
                  ${msg.sender === "user"
                    ? "bg-green-800/30 border border-green-500 text-green-200 animate-fade-in"
                    : "bg-gray-800/50 border border-green-400 text-green-300 animate-fade-in"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <section className="flex gap-4 items-center">
        <Input
          placeholder="Type your hacking-style question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          className="w-full bg-black/20 border border-green-700 text-green-300 placeholder:text-green-500 focus:ring-2 focus:ring-green-500/50 transition-all"
        />
        <Button
          onClick={handleAsk}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 flex gap-2 items-center"
        >
          {isLoading ? (
            <>
              Loading...
              <RotateCw className="ml-1 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              Send
              <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </section>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </main>
  );
}
