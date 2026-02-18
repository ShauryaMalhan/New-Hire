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

// --- NEW IMPORT: Session Database Logic ---
// We now import session-based functions instead of simple saveMessage
import { createSession, getUserSessions, getSessionMessages, saveMessage } from './db.js'; 

const app = express();
const upload = multer({ dest: 'uploads/' }); 

app.use(cors());
app.use(express.json());

console.log("🚀 Starting RAG Server...");
await initVectorStore();

// --- 1. NEW: Get All Sessions (Sidebar List) ---
app.get('/sessions/:ciscoId', async (req, res) => {
    try {
        const sessions = await getUserSessions(req.params.ciscoId);
        res.json({ sessions });
    } catch (err) {
        console.error("Sidebar Error:", err);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
});

// --- 2. NEW: Get Messages for ONE Session (Main Chat Window) ---
app.get('/session/:sessionId', async (req, res) => {
    try {
        const history = await getSessionMessages(req.params.sessionId);
        res.json({ history });
    } catch (err) {
        console.error("Chat Load Error:", err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// --- 3. UPDATED: Query Endpoint (Handles Session Creation) ---
app.post('/query', async (req, res) => {
    // Now accepts sessionId (optional)
    let { question, ciscoId, sessionId } = req.body; 
    console.log(`\n🔎 Query: "${question}" (User: ${ciscoId}, Session: ${sessionId || 'New'})`);

    try {
        // A. If no Session ID, Create a NEW Session (Thread)
        if (!sessionId && ciscoId) {
            sessionId = await createSession(ciscoId, question);
            console.log(`✨ Created New Session: ${sessionId}`);
        }

        // B. Save User Question to DB
        if (sessionId) {
            await saveMessage(sessionId, 'user', question);
        }

        // C. Perform RAG Search (Existing Logic)
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

        // D. Generate Answer
        const response = await generateAnswer(question, allContexts);
        // Response is { answer: "...", sources: [...] }

        // E. Save Bot Answer to DB
        if (sessionId) {
            await saveMessage(sessionId, 'bot', response.answer, response.sources);
        }

        // F. Return Answer AND the Session ID
        // The frontend needs the sessionId to switch the URL/State to the active chat
        res.json({ 
            ...response, 
            sessionId 
        });

    } catch (error) {
        console.error("Query Failed:", error);
        res.status(500).json({ error: "RAG Pipeline Failed" });
    }
});

// --- 4. Upload Endpoint (Unchanged) ---
app.post('/admin/upload', upload.single('file'), (req, res) => {
    const { text } = req.body; 
    const file = req.file;     
    
    if (!fs.existsSync(CONFIG.DATA_DIR)) {
        fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
    }

    if (file) {
        const targetPath = path.join(CONFIG.DATA_DIR, file.originalname);
        if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
        fs.renameSync(file.path, targetPath);
        console.log(`📄 File stored: ${file.originalname}`);
        res.json({ 
            status: "success", 
            message: `File '${file.originalname}' saved. Go to /admin/reindex to apply changes.` 
        });

    } else if (text) {
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

// --- 5. Re-Index Endpoint (Unchanged) ---
app.post('/admin/reindex', async (req, res) => {
    try {
        console.log("\n🔄 STARTING FULL RE-INDEXING...");
        await resetVectorDB();
        const chunks = await loadAndChunkFiles();
        
        if (chunks.length === 0) {
            return res.json({ message: "Data folder is empty. DB cleared." });
        }

        await addDocumentsToVectorDB(chunks);
        buildKeywordIndex(chunks);
        
        console.log(`✅ RE-INDEX COMPLETE: ${chunks.length} chunks.`);
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