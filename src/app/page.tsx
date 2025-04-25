"use client";

import { useState, useCallback } from "react";
import { sageInteraction } from "@/ai/flows/sage-interaction";
import { devilkingsScenario } from "@/ai/flows/devilkings-scenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { RotateCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [sageResponse, setSageResponse] = useState<string | null>(null);
  const [devilkingsResponse, setDevilkingsResponse] = useState<string | null>(
    null
  );
  const [isLoadingSage, setIsLoadingSage] = useState(false);
  const [isLoadingDevilkings, setIsLoadingDevilkings] = useState(false);
  const { toast } = useToast();

  const formatCodeOutput = (code: string) => {
    return (
      <div className="font-mono text-sm bg-gray-800 text-green-400 p-2 rounded-md">
        <pre>{code}</pre>
      </div>
    );
  };


  const handleSageInteraction = useCallback(async () => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question.",
      });
      return;
    }

    setIsLoadingSage(true);
    setSageResponse(null); // Clear previous response
    try {
      const result = await sageInteraction({ question });
      setSageResponse(result.answer);
    } catch (error: any) {
      console.error("Sage Interaction Error:", error);
      toast({
        title: "Error",
        description: `Failed to get Sage response: ${error.message}`,
      });
      setSageResponse(`Error: ${error.message}`);
    } finally {
      setIsLoadingSage(false);
    }
  }, [question, toast]);

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
    try {
      const result = await devilkingsScenario({ question });
      setDevilkingsResponse(result.response);
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
    <div className="flex flex-col min-h-screen bg-background p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-primary">
          CyberSage Spark
        </h1>
        <p className="text-muted-foreground">
          Ask cybersecurity questions and get insights from Sage and Devilkings.
        </p>
      </header>

      <section className="mb-6">
        <div className="flex items-center space-x-2">
         <Textarea
            placeholder="Enter your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-grow"
          />
          <Button
            onClick={handleSageInteraction}
            disabled={isLoadingSage}
            className="bg-primary text-primary-foreground hover:bg-primary/80"
          >
            {isLoadingSage ? (
              <>
                Loading...
                <RotateCw className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Ask Sage"
            )}
          </Button>
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
              "Ask Devilkings"
            )}
          </Button>
        </div>
      </section>

      <section className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
        <Card className="flex-1 bg-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Sage</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea className="h-[200px] md:h-[300px] w-full">
              {sageResponse ? (
                  typeof sageResponse === 'string' && sageResponse.startsWith('```') ? (
                    formatCodeOutput(sageResponse)
                  ) : (
                    <div className="font-mono text-sm bg-gray-800 text-green-400 p-2 rounded-md">
                      <pre>{sageResponse}</pre>
                    </div>
                  )
              ) : (
                <p className="text-muted-foreground">
                  No response yet. Ask Sage a question!
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="flex-1 bg-secondary">
          <CardHeader>
            <CardTitle className="text-primary">Devilkings</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ScrollArea className="h-[200px] md:h-[300px] w-full">
              {devilkingsResponse ? (
                  typeof devilkingsResponse === 'string' && devilkingsResponse.startsWith('```') ? (
                    formatCodeOutput(devilkingsResponse)
                  ) : (
                    <div className="font-mono text-sm bg-gray-800 text-green-400 p-2 rounded-md">
                      <pre>{devilkingsResponse}</pre>
                    </div>
                  )
              ) : (
                <p className="text-muted-foreground">
                  No response yet. Ask Devilkings a question!
                </p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
