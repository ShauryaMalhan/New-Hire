import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CONFIG = {
    // Points to the 'data' folder one level up
    DATA_DIR: path.join(__dirname, '../data'),
    // Where your ChromaDB is running
    CHROMA_URL: "http://localhost:8000", 
    
    // CHANGED: Collection name updated
    COLLECTION_NAME: "nexboard",
    
    // The model you pulled in Ollama
    OLLAMA_MODEL: "llama3.2", 
    // This runs the embeddings locally via Ollama
    EMBEDDING_MODEL: "nomic-embed-text", 
    CHUNK_SIZE: 500,
    CHUNK_OVERLAP: 50
};