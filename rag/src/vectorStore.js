// src/vectorStore.js
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/ollama";
import { ChromaClient } from 'chromadb'; // 📦 NEW IMPORT
import { CONFIG } from './config.js';

const embeddings = new OllamaEmbeddings({
    model: CONFIG.EMBEDDING_MODEL, 
    baseUrl: CONFIG.OLLAMA_BASE_URL
});

let vectorStore = null;

// Initialize connection (Same as before)
export async function initVectorStore() {
    try {
        vectorStore = await Chroma.fromExistingCollection(embeddings, {
            collectionName: CONFIG.COLLECTION_NAME,
            url: CONFIG.CHROMA_URL
        });
        const collection = await vectorStore.ensureCollection();
        console.log(`🔹 Connected to collection: "${CONFIG.COLLECTION_NAME}"`);
    } catch (e) {
        console.log("🔸 Initializing new collection connection...");
        vectorStore = null;
    }
}

// 🧨 NEW FUNCTION: Wipes the DB Clean
export async function resetVectorDB() {
    console.log("🧨 RESET TRIGGERED: Deleting existing collection...");
    try {
        // We use the raw client to perform administrative delete
        const client = new ChromaClient({ path: CONFIG.CHROMA_URL });
        
        // Try to delete the collection
        await client.deleteCollection({ name: CONFIG.COLLECTION_NAME });
        console.log("🗑️  Collection deleted successfully.");
        
        // Reset our local variable
        vectorStore = null;
        return true;
    } catch (e) {
        console.log("⚠️  Could not delete collection (might not exist yet).");
        return false;
    }
}

// Add documents (Same as before)
export async function addDocumentsToVectorDB(chunks) {
    if (chunks.length === 0) return;
    
    // Auto-create collection if it was just deleted
    vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
        collectionName: CONFIG.COLLECTION_NAME,
        url: CONFIG.CHROMA_URL
    });
    
    console.log(`✅ Added ${chunks.length} chunks to the database.`);
}

// Search (Same as before)
export async function searchVectorDB(query, k = 10) { 
    if (!vectorStore) await initVectorStore();
    if (!vectorStore) return [];
    
    // Hardcoded 10 to ensure retrieval depth
    return await vectorStore.similaritySearchWithScore(query, 10);
}