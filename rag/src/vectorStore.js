import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/ollama";
import { CONFIG } from './config.js';

const embeddings = new OllamaEmbeddings({
    model: CONFIG.EMBEDDING_MODEL, 
    baseUrl: "http://localhost:11434" // Default Ollama port
});

let vectorStore = null;

export async function initVectorStore() {
    try {
        vectorStore = await Chroma.fromExistingCollection(embeddings, {
            collectionName: CONFIG.COLLECTION_NAME,
            url: CONFIG.CHROMA_URL
        });
        console.log("🔹 Connected to existing Vector Store.");
    } catch (e) {
        console.log("🔸 No existing collection found. Will create new one on ingestion.");
    }
}

export async function addDocumentsToVectorDB(chunks) {
    if (chunks.length === 0) return;

    // Create new store or add to existing
    vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
        collectionName: CONFIG.COLLECTION_NAME,
        url: CONFIG.CHROMA_URL
    });
    
    console.log("✅ Vector DB updated with new documents.");
}

export async function searchVectorDB(query, k = 3) {
    if (!vectorStore) {
        await initVectorStore();
    }
    if (!vectorStore) {
        console.log("⚠️ Vector store not ready.");
        return [];
    }
    
    // Returns results
    return await vectorStore.similaritySearchWithScore(query, k);
}