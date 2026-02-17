import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/ollama";
import { CONFIG } from './config.js';

const embeddings = new OllamaEmbeddings({
    model: CONFIG.EMBEDDING_MODEL, 
    baseUrl: CONFIG.OLLAMA_BASE_URL
});

let vectorStore = null;

export async function initVectorStore() {
    try {
        // We explicitly use the collection name from your config
        vectorStore = await Chroma.fromExistingCollection(embeddings, {
            collectionName: CONFIG.COLLECTION_NAME,
            url: CONFIG.CHROMA_URL
        });
        
        // This check ensures the collection actually has data
        const collection = await vectorStore.ensureCollection();
        const count = await collection.count();
        
        if (count > 0) {
            console.log(`🔹 Connected to existing Vector Store with ${count} chunks.`);
        } else {
            console.log("🔸 Collection exists but is currently empty.");
        }
    } catch (e) {
        console.log("🔸 No existing collection found or could not connect.");
        vectorStore = null; 
    }
}

export async function addDocumentsToVectorDB(chunks) {
    if (chunks.length === 0) return;

    // This creates the collection if it doesn't exist AND adds documents
    vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
        collectionName: CONFIG.COLLECTION_NAME,
        url: CONFIG.CHROMA_URL
    });
    
    console.log("✅ Vector DB updated and persisted.");
}

export async function searchVectorDB(query, k = 4) { // Increased default k
    if (!vectorStore) {
        await initVectorStore();
    }
    
    if (!vectorStore) {
        console.log("⚠️ Vector store not ready (No data ingested yet).");
        return [];
    }
    
    return await vectorStore.similaritySearchWithScore(query, k);
}