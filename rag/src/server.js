import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { loadAndChunkFiles } from './ingestion.js';
import { addDocumentsToVectorDB, searchVectorDB, initVectorStore, resetVectorDB } from './vectorStore.js';
import { buildKeywordIndex, searchKeywordDB } from './keywordStore.js';
import { generateAnswer } from './generator.js';

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temp storage for files

app.use(cors());
app.use(express.json());

console.log("🚀 Starting RAG Server...");
await initVectorStore();

// --- 1. Query Endpoint (Unchanged) ---
app.post('/query', async (req, res) => {
    const { question } = req.body;
    console.log(`\n🔎 Query: "${question}"`);

    // Fetch 10 chunks to ensure we get broad context
    const vectorResults = await searchVectorDB(question, 10);
    const vectorTexts = vectorResults.map(([doc, score]) => {
        const source = doc.metadata?.source || "Unknown";
        return `[Source: ${source}]\n${doc.pageContent}`;
    });

    const keywordResults = searchKeywordDB(question, 5);
    const keywordTexts = keywordResults.map(res => 
        typeof res === 'string' ? res : `[Source: Keyword]\n${res.pageContent || res}`
    );

    const allContexts = [...new Set([...vectorTexts, ...keywordTexts])];
    console.log(`✅ Context: ${allContexts.length} chunks.`);

    const response = await generateAnswer(question, allContexts);
    res.json(response);
});

// --- 2. UPDATED: Upload Endpoint (Files OR Text) ---
// This handles saving data to disk. It does NOT touch the DB yet.
app.post('/admin/upload', upload.single('file'), (req, res) => {
    const { text } = req.body; // Check for raw text input
    const file = req.file;     // Check for file input
    
    // Ensure data directory exists
    if (!fs.existsSync(CONFIG.DATA_DIR)) {
        fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
    }

    if (file) {
        // CASE A: User uploaded a file (PDF, TXT, etc.)
        const targetPath = path.join(CONFIG.DATA_DIR, file.originalname);
        
        // Remove existing file with same name if it exists
        if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
        
        fs.renameSync(file.path, targetPath);
        console.log(`📄 File stored: ${file.originalname}`);
        
        res.json({ 
            status: "success", 
            message: `File '${file.originalname}' saved. Go to /admin/reindex to apply changes.` 
        });

    } else if (text) {
        // CASE B: User pasted raw text (e.g., "The secret code is RedFalcon")
        // We save this as a new text file automatically.
        const filename = `manual_entry_${Date.now()}.txt`;
        const textPath = path.join(CONFIG.DATA_DIR, filename);
        
        fs.writeFileSync(textPath, text);
        console.log(`📝 Text input saved to: ${filename}`);
        
        res.json({ 
            status: "success", 
            message: `Text saved as '${filename}'. Go to /admin/reindex to apply changes.` 
        });

    } else {
        res.status(400).json({ error: "No file or text provided." });
    }
});

// --- 3. Re-Index Endpoint (The "Hard Reset") ---
// This deletes the DB and re-ingests EVERYTHING in the data folder.
app.post('/admin/reindex', async (req, res) => {
    try {
        console.log("\n🔄 STARTING FULL RE-INDEXING...");
        
        // 1. Wipe the Database
        await resetVectorDB();
        
        // 2. Read ALL files (PDFs + the new manual_entry.txt files)
        const chunks = await loadAndChunkFiles();
        
        if (chunks.length === 0) {
            return res.json({ message: "Data folder is empty. DB cleared." });
        }

        // 3. Ingest everything fresh
        await addDocumentsToVectorDB(chunks);
        buildKeywordIndex(chunks);
        
        console.log(`✅ RE-INDEX COMPLETE: ${chunks.length} documents processed.`);
        
        res.json({ 
            status: "success", 
            message: `Index rebuilt with ${chunks.length} chunks.` 
        });
    } catch (err) {
        console.error("❌ Reindexing Failed:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(CONFIG.PORT, () => {
    console.log(`✅ Server listening on http://localhost:${CONFIG.PORT}`);
});