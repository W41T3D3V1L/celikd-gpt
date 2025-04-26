"use client";

import { useState, useCallback, useRef } from "react";
import { devilkingsScenario } from "@/ai/flows/devilkings-scenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RotateCw } from "lucide-react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [devilkingsResponse, setDevilkingsResponse] = useState<string | null>(null);
  const [isLoadingDevilkings, setIsLoadingDevilkings] = useState(false);
  const { toast } = useToast();
  const devilkingsResponseRef = useRef<HTMLDivElement>(null);

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

  return (
    <main className="min-h-screen bg-black text-green-400 p-6 font-mono">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-widest text-green-500">
          CELIKD GPT
        </h1>
        <p className="text-sm text-gray-500 mt-4">
          This interface is strictly for <span className="text-white">educational use</span> only.
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

      <section className="mt-4">
        <ScrollArea className="h-[300px] w-full">
          <div
            ref={devilkingsResponseRef}
            className="whitespace-pre-wrap break-words text-sm tracking-wide"
          >
            {devilkingsResponse ? (
              <>{devilkingsResponse}</>
            ) : (
              <span className="text-gray-600">No response yet. Ask CELIKD something...</span>
            )}
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
