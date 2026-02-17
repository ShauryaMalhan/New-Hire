import fs from 'fs';
import path from 'path';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CONFIG } from './config.js';

// 🧹 Helper: Cleans noise from PDF text
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ') // Collapse multiple spaces/newlines into one single space
        .replace(/\.{3,}/g, '') // Remove dots "......" often found in Tables of Contents
        .trim();
}

export async function loadAndChunkFiles() {
    const documents = [];
    
    // Ensure data directory exists
    if (!fs.existsSync(CONFIG.DATA_DIR)) {
        fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
    }

    const files = fs.readdirSync(CONFIG.DATA_DIR);
    console.log(`📂 Found files: ${files.length}`);

    for (const file of files) {
        const filePath = path.join(CONFIG.DATA_DIR, file);
        
        try {
            if (file.endsWith('.pdf')) {
                console.log(`📄 Processing PDF: ${file}`);
                const loader = new PDFLoader(filePath, {
                    splitPages: false // Load entire PDF as one text first to handle cross-page sentences
                });
                const docs = await loader.load();

                // Clean the text and attach simple metadata
                docs.forEach(doc => {
                    doc.pageContent = cleanText(doc.pageContent);
                    doc.metadata = { source: file }; // Overwrite complex PDF metadata with simple filename
                });

                documents.push(...docs);

            } else if (file.endsWith('.txt')) {
                console.log(`📝 Processing TXT: ${file}`);
                const text = fs.readFileSync(filePath, 'utf-8');
                
                documents.push({ 
                    pageContent: cleanText(text), 
                    metadata: { source: file } 
                });
            }
        } catch (err) {
            console.error(`❌ Error reading file ${file}:`, err);
        }
    }

    if (documents.length === 0) {
        console.log("⚠️ No documents found to process.");
        return [];
    }

    // 🧠 SMART CHUNKING STRATEGY
    // We prioritize splitting by Paragraphs (\n\n), then Sentences (.), then Words.
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: CONFIG.CHUNK_SIZE,       // Recommendation: 800 - 1000 chars
        chunkOverlap: CONFIG.CHUNK_OVERLAP, // Recommendation: 100 - 200 chars
        separators: ["\n\n", "\n", ". ", "? ", "! ", " ", ""] 
    });

    const chunks = await splitter.splitDocuments(documents);
    console.log(`✅ Chunking complete. Created ${chunks.length} smart chunks.`);
    return chunks;
}