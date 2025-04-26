"use client";

import { useState, useCallback, useRef } from "react";
import { devilkingsScenario } from "@/ai/flows/devilkings-scenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, Bot, User, Send, Copy } from "lucide-react"; // Added Copy icon

export default function Home() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [isLoadingDevilkings, setIsLoadingDevilkings] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDevilkingsScenario = useCallback(async () => {
    if (!question.trim()) {
      toast({ title: "Error", description: "Please enter a question." });
      return;
    }

    setIsLoadingDevilkings(true);
    setMessages((prev) => [...prev, { sender: "user", text: question }]);

    try {
      const result = await devilkingsScenario({ question });
      setMessages((prev) => [...prev, { sender: "bot", text: result.response }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to get Devilkings response: ${error.message}`,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: `Error: ${error.message}` }]);
    } finally {
      setIsLoadingDevilkings(false);
      setQuestion("");
      scrollToBottom();
    }
  }, [question, toast]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({ title: "Copied!", description: "Code copied to clipboard." });
    }).catch(() => {
      toast({ title: "Error", description: "Failed to copy." });
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-green-400 p-6 font-mono">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-widest text-green-500">C3L1KD GPT</h1>
        <p className="text-sm text-gray-500 mt-2">
          Strictly for <span className="text-white">educational use</span> only.
        </p>
      </header>

      <section className="flex flex-col h-[75vh] bg-black/30 rounded-2xl p-4 overflow-hidden border border-green-700 shadow-lg">
        <ScrollArea className="flex-1 overflow-y-auto mb-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} w-full mb-3 animate-fade-in`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-md border
                  ${msg.sender === "user"
                    ? "bg-green-800/30 border-green-500 text-green-100"
                    : "bg-gradient-to-br from-gray-900 via-black to-gray-900 border-green-400 text-green-300"
                  }`}
              >
                <div className="flex items-start gap-3">
                  {msg.sender === "user" ? (
                    <User size={18} className="mt-1" />
                  ) : (
                    <Bot size={18} className="mt-1 text-green-400" />
                  )}
                  <div className="flex flex-col gap-2 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text.split("```").map((part, i) =>
                      i % 2 === 0 ? (
                        <span key={i}>{part}</span>
                      ) : (
                        <div key={i} className="relative group">
                          <pre
                            className="bg-black/70 p-3 rounded-lg border border-green-700 overflow-x-auto text-green-300 text-xs font-mono"
                          >
                            {part.trim()}
                          </pre>
                          <button
                            onClick={() => handleCopy(part.trim())}
                            className="absolute top-2 right-2 p-1 rounded-md bg-green-700/20 hover:bg-green-700/40 transition hidden group-hover:block"
                            title="Copy code"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Type your hacking-style question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleDevilkingsScenario();
            }}
            className="w-full bg-black/50 border border-green-700 text-green-300 placeholder:text-green-500"
          />
          <Button
            onClick={handleDevilkingsScenario}
            disabled={isLoadingDevilkings}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoadingDevilkings ? (
              <>
                Loading...
                <RotateCw className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <Send size={18} className="h-5 w-5" />
            )}
          </Button>
        </div>
      </section>

      {/* Animation and global fixes */}
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
        pre {
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </main>
  );
}
