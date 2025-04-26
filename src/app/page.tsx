"use client";

import { useState, useCallback, useRef } from "react";
import { devilkingsScenario } from "@/ai/flows/devilkings-scenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, Copy, Check } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [devilkingsResponse, setDevilkingsResponse] = useState<string | null>(null);
  const [isLoadingDevilkings, setIsLoadingDevilkings] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const devilkingsResponseRef = useRef<HTMLDivElement>(null);

  const handleDevilkingsScenario = useCallback(async () => {
    if (!question.trim()) {
      toast({ title: "Error", description: "Please enter a question." });
      return;
    }

    setIsLoadingDevilkings(true);
    setDevilkingsResponse(null);
    setCopied(false);

    try {
      const result = await devilkingsScenario({ question });
      setDevilkingsResponse(result.response);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to get Devilkings response: ${error.message}`,
      });
      setDevilkingsResponse(`Error: ${error.message}`);
    } finally {
      setIsLoadingDevilkings(false);
    }
  }, [question, toast]);

  const handleCopy = () => {
    if (devilkingsResponse) {
      navigator.clipboard.writeText(devilkingsResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-green-400 p-6 font-mono">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-widest text-green-500 animate-pulse">
          C3L1KD GPT
        </h1>
        <p className="text-sm text-gray-500 mt-4">
          Strictly for <span className="text-white">educational use</span> only.
        </p>
      </header>

      <section className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Enter your hacking-style question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-transparent border border-green-700 text-green-300 placeholder:text-green-500"
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
            "Ask CELIKD"
          )}
        </Button>
      </section>

      <section className="relative mt-4">
        {devilkingsResponse && (
          <Button
            onClick={handleCopy}
            size="icon"
            variant="ghost"
            className="absolute right-4 top-2 text-green-400 hover:text-green-500"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </Button>
        )}

        <ScrollArea className="w-full max-h-[80vh] p-4 pb-20">
          <div
            ref={devilkingsResponseRef}
            className="whitespace-pre-wrap break-words text-sm tracking-wide space-y-6"
          >
            {devilkingsResponse ? (
              <pre className="text-green-400">{devilkingsResponse}</pre>
            ) : (
              <span className="text-gray-600">No response yet. Ask CELIKD something...</span>
            )}
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
