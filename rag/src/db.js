import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'chat_history.db');
const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath);

db.serialize(() => {
  // 1. Table for Chat Sessions (Sidebar List)
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cisco_id TEXT,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 2. Table for Messages (Linked to Session)
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    role TEXT,
    content TEXT,
    sources TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES sessions(id)
  )`);
});

// --- HELPER FUNCTIONS ---

// Create a new session (Thread)
export const createSession = (ciscoId, firstQuestion) => {
  return new Promise((resolve, reject) => {
    // Truncate title to 30 chars
    const title = firstQuestion.length > 30 ? firstQuestion.substring(0, 30) + "..." : firstQuestion;
    const stmt = db.prepare("INSERT INTO sessions (cisco_id, title) VALUES (?, ?)");
    stmt.run(ciscoId, title, function(err) {
      if (err) reject(err);
      else resolve(this.lastID); // Return new Session ID
    });
    stmt.finalize();
  });
};

// Get all sessions for a user (Sidebar)
export const getUserSessions = (ciscoId) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM sessions WHERE cisco_id = ? ORDER BY created_at DESC", [ciscoId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Get messages for a specific session
export const getSessionMessages = (sessionId) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT role, content, sources FROM messages WHERE session_id = ? ORDER BY created_at ASC", [sessionId], (err, rows) => {
      if (err) reject(err);
      else {
        const history = rows.map(row => ({
          ...row,
          sources: row.sources ? JSON.parse(row.sources) : []
        }));
        resolve(history);
      }
    });
  });
};

// Save a message to a session
export const saveMessage = (sessionId, role, content, sources = []) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO messages (session_id, role, content, sources) VALUES (?, ?, ?, ?)");
    stmt.run(sessionId, role, content, JSON.stringify(sources), function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    stmt.finalize();
  });
};