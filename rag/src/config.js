import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
    CHROMA_URL: process.env.CHROMA_URL,
    DATA_DIR: process.env.DATA_DIR,
    COLLECTION_NAME: process.env.COLLECTION_NAME,
    CHUNK_SIZE: 600,
    CHUNK_OVERLAP: 150
};