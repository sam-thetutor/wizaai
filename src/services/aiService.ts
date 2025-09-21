import OpenAI from "openai";
import { AIMessage } from "../types";
import { Module } from "../types";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

export class AIService {
  static async sendMessage(
    message: string,
    moduleContext: Module,
    courseTitle: string,
    previousMessages: AIMessage[] = []
  ): Promise<string> {
    try {
      // Build context from module content
      const moduleContent = this.buildModuleContext(moduleContext);

      // Create system prompt for hint-based assistance
      const systemPrompt = `You are an AI learning assistant for the course "${courseTitle}". 
Your role is to provide helpful hints and guidance to students, NOT direct answers.

Current Module Context:
- Title: ${moduleContext.title}
- Type: ${moduleContext.type}
- Duration: ${moduleContext.duration}
- Content: ${moduleContent}

Guidelines:
1. Provide hints and guidance, not direct answers
2. Ask leading questions to help students think critically
3. Break down complex concepts into smaller parts
4. Encourage exploration and discovery
5. Reference the module content when relevant
6. Be encouraging and supportive
7. If students are stuck, provide progressively more specific hints
8. Keep responses concise but helpful (2-3 sentences max)

Remember: Your goal is to facilitate learning, not to give away answers.`;

      // Build conversation history
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
        ...previousMessages.slice(-6).map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: message },
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 200,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      return (
        completion.choices[0]?.message?.content ||
        "I'm having trouble processing your question right now. Could you try rephrasing it?"
      );
    } catch (error) {
      console.error("OpenAI API Error:", error);

      // Fallback to helpful generic response
      return "I'm experiencing some technical difficulties. In the meantime, try reviewing the module content and think about how the key concepts connect to your question. What specific part would you like to explore further?";
    }
  }

  static async getHint(
    moduleContext: Module,
    question: string,
    courseTitle: string
  ): Promise<string> {
    try {
      const moduleContent = this.buildModuleContext(moduleContext);

      const systemPrompt = `You are providing a learning hint for the course "${courseTitle}".

Module Context:
- Title: ${moduleContext.title}
- Content: ${moduleContent}

Provide a subtle hint that guides the student toward the answer without giving it away directly. 
Focus on helping them think about the right concepts or approach.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `I need a hint for this question: ${question}`,
          },
        ],
        max_tokens: 100,
        temperature: 0.6,
      });

      return (
        completion.choices[0]?.message?.content ||
        "Think about the main concepts covered in this module and how they might apply to your question."
      );
    } catch (error) {
      console.error("OpenAI API Error:", error);

      // Fallback hints
      const fallbackHints = [
        "Think about the fundamental principles we discussed earlier.",
        "Consider how this relates to the main topic of this module.",
        "Remember the key characteristics we highlighted.",
        "This concept builds on what you learned in the previous section.",
        "Focus on the practical applications we mentioned.",
      ];

      return fallbackHints[Math.floor(Math.random() * fallbackHints.length)];
    }
  }

  private static buildModuleContext(module: Module): string {
    return JSON.stringify(module);
  }
}
