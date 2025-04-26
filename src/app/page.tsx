"use client";

import { useState, useCallback, useRef } from "react";
import { devilkingsScenario } from "@/ai/flows/devilkings-scenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, Copy } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [devilkingsResponse, setDevilkingsResponse] = useState<string | null>(null);
  const [isLoadingDevilkings, setIsLoadingDevilkings] = useState(false);
  const { toast } = useToast();
  const devilkingsResponseRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleDevilkingsScenario = useCallback(async () => {
    if (!question.trim()) {
      toast({ title: "Error", description: "Please enter a question." });
      return;
    }

    setIsLoadingDevilkings(true);
    setDevilkingsResponse(null);

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

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    }).catch(() => {
      toast({ title: "Error", description: "Failed to copy code." });
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-green-400 p-6 font-mono">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-widest text-green-500 animate-pulse">
          C3L1KD GPT
        </h1>
        <p className="text-sm text-gray-500 mt-4">
          Strictly for <span className="text-white">educational use</span> only.
        </p>
      </header>

      <section className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Type your hacking-style question..."
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
            "Ask C3L1KD"
          )}
        </Button>
      </section>

      <section className="mt-4">
        <ScrollArea className="w-full max-h-[80vh] rounded-lg border border-green-800 p-4 bg-black/30 backdrop-blur-md">
          <div
            ref={devilkingsResponseRef}
            className="whitespace-pre-wrap break-words text-sm tracking-wide space-y-6"
          >
            {devilkingsResponse ? (
              <>
                {devilkingsResponse.split("```").map((part, index) => {
                  if (index % 2 === 1) {
                    // It's a code block
                    return (
                      <div key={index} className="relative group bg-black/40 border border-green-800 rounded-lg p-4 text-green-300 font-mono overflow-auto">
                        <button
                          onClick={() => handleCopy(part.trim(), index)}
                          className="absolute top-2 right-2 p-1 rounded-md bg-green-700/20 hover:bg-green-700/40 transition hidden group-hover:block"
                          title="Copy code"
                        >
                          {copiedIndex === index ? (
                            <span className="text-green-400 font-bold text-xs">✔ Copied</span>
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <pre className="overflow-x-auto text-sm">{part.trim()}</pre>
                      </div>
                    );
                  } else {
                    // It's text
                    return (
                      <p key={index} className="text-green-300">
                        {part}
                      </p>
                    );
                  }
                })}
              </>
            ) : (
              <span className="text-gray-600">No response yet. Ask C3L1KD something...</span>
            )}
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
