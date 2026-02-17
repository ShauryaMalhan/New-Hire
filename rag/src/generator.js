import { Ollama } from "@langchain/ollama";
import { CONFIG } from './config.js';

const llm = new Ollama({
    baseUrl: "http://localhost:11434",
    model: CONFIG.OLLAMA_MODEL,
});

export async function generateAnswer(query, contextChunks) {
    const context = contextChunks.join("\n\n");
    
    const prompt = `
    You are a helpful assistant for the Cisco Onboarding project.
    Use the following pieces of context to answer the user's question.
    If the answer is not in the context, just say "I don't have that information."
    
    Context:
    ${context}
    
    Question: ${query}
    
    Answer:
    `;

    try {
        const response = await llm.invoke(prompt);
        return response;
    } catch (error) {
        console.error("LLM Generation Error:", error);
        return "Sorry, I am having trouble connecting to the AI model.";
    }
}