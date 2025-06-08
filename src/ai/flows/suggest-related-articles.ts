
'use server';

/**
 * @fileOverview किसी दिए गए लेख की सामग्री के आधार पर संबंधित विषयों या शीर्षकों का सुझाव देने के लिए एक प्रवाह।
 * इन सुझावों का उपयोग मौजूदा लेखों को खोजने के लिए किया जा सकता है।
 *
 * - suggestRelatedArticles - एक फ़ंक्शन जो संबंधित विषयों/शीर्षकों का सुझाव देता है।
 * - SuggestRelatedArticlesInput - suggestRelatedArticles फ़ंक्शन के लिए इनपुट प्रकार।
 * - SuggestRelatedArticlesOutput - suggestRelatedArticles फ़ंक्शन के लिए रिटर्न प्रकार।
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedArticlesInputSchema = z.object({
  articleContent: z
    .string()
    .describe('उस लेख की सामग्री जिसके लिए संबंधित विषयों/शीर्षकों का सुझाव देना है (हिंदी में)।'),
  numberOfSuggestions: z
    .number()
    .default(3)
    .describe('सुझाए जाने वाले संबंधित विषयों/शीर्षकों की संख्या।'),
});
export type SuggestRelatedArticlesInput = z.infer<
  typeof SuggestRelatedArticlesInputSchema
>;

const SuggestRelatedArticlesOutputSchema = z.object({
  suggestedTopicsOrTitles: z
    .array(z.string())
    .describe('सुझाए गए संबंधित विषयों या शीर्षकों की एक सरणी (हिंदी में)। इनका उपयोग मौजूदा लेखों को खोजने के लिए किया जा सकता है।'),
});
export type SuggestRelatedArticlesOutput = z.infer<
  typeof SuggestRelatedArticlesOutputSchema
>;

export async function suggestRelatedArticles(
  input: SuggestRelatedArticlesInput
): Promise<SuggestRelatedArticlesOutput> {
  return suggestRelatedArticlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedArticlesPrompt',
  input: {schema: SuggestRelatedArticlesInputSchema},
  output: {schema: SuggestRelatedArticlesOutputSchema},
  prompt: `आप एक समाचार क्यूरेटर हैं जो संबंधित सामग्री खोजने में सहायता करते हैं।
  किसी लेख की सामग्री को देखते हुए, कुछ संबंधित विषयों या खोज शब्दों (3-5 शब्द लंबे) का सुझाव दें जिनका उपयोग समान लेख खोजने के लिए किया जा सकता है।
  सुझावों को विषयों/शीर्षकों की सूची के रूप में लौटाएं (हिंदी में)।

  लेख सामग्री: {{{articleContent}}}

  सुझावों की संख्या: {{{numberOfSuggestions}}}
  `,
});

const suggestRelatedArticlesFlow = ai.defineFlow(
  {
    name: 'suggestRelatedArticlesFlow',
    inputSchema: SuggestRelatedArticlesInputSchema,
    outputSchema: SuggestRelatedArticlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
