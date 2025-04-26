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

  const formatCodeOutput = (code: string) => (
    <div className="font-mono text-sm bg-black text-green-400 p-4 rounded-md overflow-x-auto whitespace-pre max-w-full border border-green-800">
      <pre>{code}</pre>
    </div>
  );

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
    <main className="min-h-screen bg-[#0d0d0d] text-white p-6 font-mono">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-green-400 drop-shadow tracking-widest">CELIKD GPT</h1>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto mt-4">
          Educational use only. This AI may generate code that can be harmful if misused.
          Always follow legal guidelines. Phrase prompts clearly for research purposes.
        </p>
      </header>

      <section className="mb-8 flex flex-col md:flex-row items-center gap-4">
        <Input
          placeholder="Enter your educational hacking prompt..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-grow bg-black/30 border border-gray-700 text-white placeholder:text-gray-400"
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
        <h2 className="text-lg text-green-400 mb-2">CELIKD Terminal Output:</h2>
        <ScrollArea className="h-[300px] w-full bg-black/40 border border-green-900 rounded-md p-4">
          <div ref={devilkingsResponseRef}>
            {devilkingsResponse ? (
              devilkingsResponse.includes("\n") ? (
                formatCodeOutput(devilkingsResponse)
              ) : (
                <p className="text-green-300">{devilkingsResponse}</p>
              )
            ) : (
              <p className="text-gray-500">No response yet. Ask CELIKD something...</p>
            )}
          </div>
        </ScrollArea>
      </section>
    </main>
  );
}
