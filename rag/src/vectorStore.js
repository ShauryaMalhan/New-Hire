import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/ollama";
import { ChromaClient } from 'chromadb';
import { CONFIG } from './config.js';

const embeddings = new OllamaEmbeddings({
    model: CONFIG.EMBEDDING_MODEL, 
    baseUrl: CONFIG.OLLAMA_BASE_URL
});

let vectorStore = null;

// --- 1. Initialize Connection ---
export async function initVectorStore() {
    try {
        vectorStore = await Chroma.fromExistingCollection(embeddings, {
            collectionName: CONFIG.COLLECTION_NAME,
            url: CONFIG.CHROMA_URL
        });
        await vectorStore.ensureCollection();
        console.log(`🔹 Connected to collection: "${CONFIG.COLLECTION_NAME}"`);
    } catch (e) {
        console.log("🔸 Collection not found (will be created on ingest).");
        vectorStore = null;
    }
}

// --- 2. Hard Reset (Wipe DB) ---
export async function resetVectorDB() {
    console.log("🧨 RESET TRIGGERED: Deleting existing collection...");
    try {
        const client = new ChromaClient({ path: CONFIG.CHROMA_URL });
        await client.deleteCollection({ name: CONFIG.COLLECTION_NAME });
        console.log("🗑️  Collection deleted successfully.");
        vectorStore = null;
        return true;
    } catch (e) {
        console.log("⚠️  Could not delete collection (might not exist yet).");
        return false;
    }
}

// --- 3. Add Documents (Ingest) ---
export async function addDocumentsToVectorDB(chunks) {
    if (chunks.length === 0) return;
    
    console.log(`🔄 Adding ${chunks.length} chunks to ChromaDB...`);
    vectorStore = await Chroma.fromDocuments(chunks, embeddings, {
        collectionName: CONFIG.COLLECTION_NAME,
        url: CONFIG.CHROMA_URL
    });
    console.log(`✅ Successfully stored ${chunks.length} chunks.`);
}

// --- 4. Search (Standard & Reliable) ---
export async function searchVectorDB(query, k = 10) { 
    if (!vectorStore) await initVectorStore();
    
    if (!vectorStore) {
        console.log("⚠️ Vector store not ready (No data ingested).");
        return [];
    }
    
    console.log(`🧠 Asking Chroma for top ${k} results...`);
    
    try {
        // We stick to the standard search because it is 100% reliable in JS
        const results = await vectorStore.similaritySearchWithScore(query, k);
        
        console.log(`📦 Chroma returned ${results.length} chunks.`);
        
        // Return raw results (Server.js handles the formatting)
        return results;
        
    } catch (error) {
        console.error("❌ Chroma Search Error:", error);
        return [];
    }
}