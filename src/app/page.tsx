"use client";

import { useState, useCallback, useRef } from "react";
import { devilkingsScenario } from "@/ai/flows/devilkings-scenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RotateCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [devilkingsResponse, setDevilkingsResponse] = useState<string | null>(
    null
  );
  const [isLoadingDevilkings, setIsLoadingDevilkings] = useState(false);
  const { toast } = useToast();

  const devilkingsResponseRef = useRef<HTMLDivElement>(null);

  const formatCodeOutput = (text: string) => {
    const lines = text.split('\n');
    let codeBlock = '';
    let description = '';
    let inCode = false;

    lines.forEach(line => {
      if (line.startsWith('```')) {
        inCode = !inCode;
        if (inCode) {
          codeBlock += '<pre class="font-mono text-sm bg-gray-800 text-green-400 p-2 rounded-md overflow-x-auto whitespace-pre max-w-full">';
        } else {
          codeBlock += '</pre>';
        }
      } else {
        if (inCode) {
          codeBlock += line + '\n';
        } else {
          description += line + '\n';
        }
      }
    });

    let formattedOutput = '';
    if (description.trim() !== '') {
      formattedOutput += `<p class="font-medium text-white">${description.trim()}</p>`;
    }
    if (codeBlock.trim() !== '') {
      formattedOutput += codeBlock;
    }

    return <div dangerouslySetInnerHTML={{ __html: formattedOutput }} />;
  };

  const handleDevilkingsScenario = useCallback(async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question.",
      });
      return;
    }

    setIsLoadingDevilkings(true);
    setDevilkingsResponse(null); // Clear previous response
    if (devilkingsResponseRef.current) {
      devilkingsResponseRef.current.scrollTop = 0;
    }
    try {
      const result = await devilkingsScenario({ question });
      setDevilkingsResponse(result.response);
      if (devilkingsResponseRef.current) {
        devilkingsResponseRef.current.scrollTop = 0;
      }
    } catch (error: any) {
      console.error("Devilkings Scenario Error:", error);
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
    <div className="flex flex-col min-h-screen bg-background p-4 md:p-8 dark">
      <header className="mb-10 text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary drop-shadow-md tracking-wide">
          CELIKD GPT
        </h1>

        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          This project may generate or demonstrate code that could be considered
          illegal if misused. <br />
          It is provided strictly for{" "}
          <span className="font-semibold text-white">educational purposes only</span>.
          <br />
          I am not responsible for how this code is used. <br />
          <span className="text-yellow-400 font-medium">
            Use at your own risk
          </span>{" "}
          and always follow applicable laws and regulations.
        </p>
      </header>

      <section className="mb-6">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-grow text-white"
          />
          <div className="flex flex-col">
            <Button
              onClick={handleDevilkingsScenario}
              disabled={isLoadingDevilkings}
              className="bg-primary text-primary-foreground hover:bg-primary/80"
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
          </div>
        </div>
        <span className="text-xs text-muted-foreground text-center">AGENTS</span>
      </section>

      <section className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
        {devilkingsResponse ? (
          <div
            ref={devilkingsResponseRef}
            className="flex-1 bg-secondary p-4 rounded-md"
          >
            {/* Adding explanation text above code blocks */}
            <div className="mb-4">
              {formatCodeOutput(devilkingsResponse)}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No response yet. Ask CELIKD a question!
          </p>
        )}
      </section>
    </div>
  );
}
