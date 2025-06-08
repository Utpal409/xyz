
'use server';
/**
 * @fileOverview A Genkit flow to generate search queries based on article content.
 * These queries can be used to find related articles.
 *
 * - generateSearchQueries - A function that generates search queries.
 * - GenerateSearchQueriesInput - The input type for the function.
 * - GenerateSearchQueriesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSearchQueriesInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to generate search queries for (Hindi).'),
  numQueries: z
    .number()
    .default(3)
    .describe('The number of search queries to generate.'),
});
export type GenerateSearchQueriesInput = z.infer<
  typeof GenerateSearchQueriesInputSchema
>;

const GenerateSearchQueriesOutputSchema = z.object({
  queries: z
    .array(z.string())
    .describe('An array of suggested search queries (Hindi) to find related articles.'),
});
export type GenerateSearchQueriesOutput = z.infer<
  typeof GenerateSearchQueriesOutputSchema
>;

export async function generateSearchQueries(
  input: GenerateSearchQueriesInput
): Promise<GenerateSearchQueriesOutput> {
  return generateSearchQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSearchQueriesPrompt',
  input: {schema: GenerateSearchQueriesInputSchema},
  output: {schema: GenerateSearchQueriesOutputSchema},
  prompt: `आप एक सहायक हैं जो लेख सामग्री के आधार पर खोज क्वेरी उत्पन्न करने में मदद करते हैं।
  दिए गए लेख की सामग्री के लिए, {{numQueries}} खोज क्वेरी (प्रत्येक 3-5 शब्द लंबी) सुझाएं जिनका उपयोग संबंधित लेख खोजने के लिए किया जा सकता है।
  क्वेरीज़ को खोज शब्दों की सूची के रूप में लौटाएं (हिंदी में)।

  लेख सामग्री: {{{articleContent}}}
  `,
});

const generateSearchQueriesFlow = ai.defineFlow(
  {
    name: 'generateSearchQueriesFlow',
    inputSchema: GenerateSearchQueriesInputSchema,
    outputSchema: GenerateSearchQueriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
