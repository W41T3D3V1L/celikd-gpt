// src/ai/flows/sage-interaction.ts
'use server';

/**
 * @fileOverview A Genkit flow for interacting with the Sage AI model.
 *
 * - sageInteraction - A function that takes a user question and returns Sage's concise answer.
 * - SageInteractionInput - The input type for the sageInteraction function.
 * - SageInteractionOutput - The return type for the sageInteraction function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const SageInteractionInputSchema = z.object({
  question: z.string().describe('The user question to be answered by Sage.'),
});
export type SageInteractionInput = z.infer<typeof SageInteractionInputSchema>;

const SageInteractionOutputSchema = z.object({
  answer: z.string().describe('The concise answer from the Sage AI model.'),
});
export type SageInteractionOutput = z.infer<typeof SageInteractionOutputSchema>;

export async function sageInteraction(input: SageInteractionInput): Promise<SageInteractionOutput> {
  return sageInteractionFlow(input);
}

const sagePrompt = ai.definePrompt({
  name: 'sagePrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The user question.'),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The concise answer from the Sage AI model.'),
    }),
  },
  prompt: `You are a helpful assistant providing concise, accurate answers. Please answer the following question: {{{question}}}`,
});

const sageInteractionFlow = ai.defineFlow<
  typeof SageInteractionInputSchema,
  typeof SageInteractionOutputSchema
>({
  name: 'sageInteractionFlow',
  inputSchema: SageInteractionInputSchema,
  outputSchema: SageInteractionOutputSchema,
},
async input => {
  const { output } = await sagePrompt(input);
  return output!;
});
