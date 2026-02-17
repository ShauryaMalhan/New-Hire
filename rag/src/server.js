import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { CONFIG } from './config.js';
import { loadAndChunkFiles } from './ingestion.js';
import { addDocumentsToVectorDB, searchVectorDB, initVectorStore } from './vectorStore.js';
import { buildKeywordIndex, searchKeywordDB } from './keywordStore.js';
import { generateAnswer } from './generator.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Initialize systems
console.log("🚀 Starting RAG Server...");
await initVectorStore();

// --- 1. Query Endpoint ---
app.post('/query', async (req, res) => {
    const { question } = req.body;
    
    console.log(`\n🔎 New Query: "${question}"`);

    // A. Vector Search
    const vectorResults = await searchVectorDB(question, 3);
    const vectorTexts = vectorResults.map(res => res[0].pageContent);
    
    // B. Keyword Search
    const keywordTexts = searchKeywordDB(question, 3);
    
    // C. Combine & Deduplicate
    const allContexts = [...new Set([...vectorTexts, ...keywordTexts])];
    
    console.log(`Found ${allContexts.length} relevant chunks.`);

    // D. Generate Answer
    const answer = await generateAnswer(question, allContexts);
    
    res.json({ answer, context: allContexts });
});

// --- 2. Admin Ingest Endpoint ---
app.post('/admin/ingest', upload.single('file'), async (req, res) => {
    const { text } = req.body;
    const file = req.file;

    if (!fs.existsSync(CONFIG.DATA_DIR)) {
        fs.mkdirSync(CONFIG.DATA_DIR);
    }

    if (file) {
        // Move uploaded file to data folder
        const targetPath = path.join(CONFIG.DATA_DIR, file.originalname);
        fs.renameSync(file.path, targetPath);
        console.log(`📄 Saved file: ${file.originalname}`);
    } else if (text) {
        // Save text input as a .txt file
        const textPath = path.join(CONFIG.DATA_DIR, `admin_fix_${Date.now()}.txt`);
        fs.writeFileSync(textPath, text);
        console.log(`📝 Saved text input.`);
    }

    // Re-process everything (Simple "Fresh" Ingest)
    try {
        const chunks = await loadAndChunkFiles();
        await addDocumentsToVectorDB(chunks);
        buildKeywordIndex(chunks);
        res.json({ status: "success", message: "Knowledge base updated!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: err.message });
    }
});

app.listen(3000, () => {
    console.log('✅ Server listening on http://localhost:3000');
});