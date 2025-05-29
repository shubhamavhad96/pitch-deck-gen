// utils/generateSlides.ts
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

// 1. Prompt template
const prompt = new PromptTemplate({
  template: `
You are a startup mentor. Based on the following idea, generate content for a pitch deck slide.

Slide Type: {slideType}
Startup Idea: {idea}
Industry: {industry}
Tone: {tone}

Respond with 1 paragraph only.`,
  inputVariables: ["slideType", "idea", "industry", "tone"]
});

// 2. Use Ollama (LLaMA 3 by default)
const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Ollama server
  model: "llama3",                   // Or "mistral", etc.
  temperature: 0.7
});

const chain = new LLMChain({ llm: model, prompt });

// 3. Slide content generator
export async function generateSlideContent(
  slideType: string,
  idea: string,
  industry: string,
  tone: string
): Promise<string> {
  try {
    const response = await chain.call({ slideType, idea, industry, tone });
    let text = response.text;

    // ✅ Clean intro phrases like "Here's a potential solution for the Problem slide:"
    text = text.replace(
      /^.*?(Problem|Solution|Market|Team|Business Model).*?:\s*/i,
      ""
    ).trim();

    return text;
  } catch (err) {
    console.error(`🔥 Error generating ${slideType} slide:`, err);
    throw err;
  }
}
