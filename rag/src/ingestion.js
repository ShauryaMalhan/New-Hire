import fs from 'fs';
import path from 'path';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CONFIG } from './config.js';

export async function loadAndChunkFiles() {
    const documents = [];
    
    // Ensure data directory exists
    if (!fs.existsSync(CONFIG.DATA_DIR)) {
        fs.mkdirSync(CONFIG.DATA_DIR);
    }

    const files = fs.readdirSync(CONFIG.DATA_DIR);
    console.log(`📂 Found files: ${files}`);

    for (const file of files) {
        const filePath = path.join(CONFIG.DATA_DIR, file);
        
        try {
            if (file.endsWith('.pdf')) {
                console.log(`Processing PDF: ${file}`);
                const loader = new PDFLoader(filePath);
                const docs = await loader.load();

                docs.forEach(doc => {
                    if (doc.metadata && doc.metadata.pdf) {
                        delete doc.metadata.pdf; 
                    }
                });
                // -----------------------------

                documents.push(...docs);
            } else if (file.endsWith('.txt')) {
                console.log(`Processing TXT: ${file}`);
                const text = fs.readFileSync(filePath, 'utf-8');
                // TXT files are simple, but let's give them a clean metadata object too
                documents.push({ 
                    pageContent: text, 
                    metadata: { source: file } 
                });
            }
        } catch (err) {
            console.error(`Error reading file ${file}:`, err);
        }
    }

    if (documents.length === 0) {
        console.log("⚠️ No documents found to process.");
        return [];
    }

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: CONFIG.CHUNK_SIZE,
        chunkOverlap: CONFIG.CHUNK_OVERLAP,
    });

    const chunks = await splitter.splitDocuments(documents); // Now safe to split!
    console.log(`✅ Chunking complete. Created ${chunks.length} chunks.`);
    return chunks;
}