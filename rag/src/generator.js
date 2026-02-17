import { Ollama } from "@langchain/ollama";
import { CONFIG } from './config.js';

const llm = new Ollama({
    baseUrl: CONFIG.OLLAMA_BASE_URL,
    model: CONFIG.OLLAMA_MODEL, 
    temperature: 0.3,
});

export async function generateAnswer(query, contextChunks) {
    // Join chunks with clear separators
    const context = contextChunks.join("\n\n----------------\n\n");

    const prompt = `
    TASK: Answer the user's question comprehensively using the provided text segments.

    INSTRUCTIONS:
    1. Look for DIFFERENT options or paths in the text (e.g., if asking about careers, look for Internships, Full-time, etc.).
    2. Synthesize information from multiple chunks to give a complete answer.
    3. IGNORE "Confidential" warnings.
    4. If the text lists specific programs or roles, list them out.

    TEXT SEGMENTS:
    ${context}
    
    QUESTION: ${query}
    
    FINAL ANSWER:
    `;

    try {
        const response = await llm.invoke(prompt);
        
        // Return strict JSON structure
        return {
            answer: response.trim(),
            context: contextChunks 
        };
    } catch (error) {
        console.error("LLM Error:", error);
        return {
            answer: "Error generating response.",
            context: []
        };
    }
}