import express from "express";
import { createClient } from "@libsql/client";

const clients = new Map<string, ReturnType<typeof createClient>>();

function getDb(req: express.Request) {
  const url = (req.headers['x-turso-url'] as string) || process.env.TURSO_DATABASE_URL;
  const authToken = (req.headers['x-turso-token'] as string) || process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('Database credentials missing. Please provide them in settings.');
  }

  const key = `${url}|${authToken}`;
  if (!clients.has(key)) {
    clients.set(key, createClient({ url, authToken }));
  }
  return clients.get(key)!;
}

const app = express();

app.use(express.json({ limit: '10mb' }));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Initialize DB Schema
app.post("/api/init-db", async (req, res) => {
  try {
    const db = getDb(req);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
    res.json({ success: true, message: "Database initialized successfully" });
  } catch (error: any) {
    console.error("DB Init Error:", error);
    const status = error.message.includes('credentials missing') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
});

// Get all resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const db = getDb(req);
    const result = await db.execute("SELECT id, title, created_at, updated_at FROM resumes ORDER BY updated_at DESC");
    res.json(result.rows);
  } catch (error: any) {
    console.error("Get Resumes Error:", error);
    const status = error.message.includes('credentials missing') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
});

// Get a specific resume
app.get("/api/resumes/:id", async (req, res) => {
  try {
    const db = getDb(req);
    const result = await db.execute({
      sql: "SELECT * FROM resumes WHERE id = ?",
      args: [req.params.id]
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Get Resume Error:", error);
    const status = error.message.includes('credentials missing') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
});

// Save (Create or Update) a resume
app.post("/api/resumes", async (req, res) => {
  try {
    const db = getDb(req);
    const { id, title, data } = req.body;
    
    if (!id || !title || !data) {
      return res.status(400).json({ error: "Missing required fields (id, title, data)" });
    }

    // Check if exists
    const existing = await db.execute({
      sql: "SELECT id FROM resumes WHERE id = ?",
      args: [id]
    });

    if (existing.rows.length > 0) {
      await db.execute({
        sql: "UPDATE resumes SET title = ?, data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        args: [title, JSON.stringify(data), id]
      });
    } else {
      await db.execute({
        sql: "INSERT INTO resumes (id, title, data) VALUES (?, ?, ?)",
        args: [id, title, JSON.stringify(data)]
      });
    }
    
    res.json({ success: true, id });
  } catch (error: any) {
    console.error("Save Resume Error:", error);
    const status = error.message.includes('credentials missing') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
});

// Delete a resume
app.delete("/api/resumes/:id", async (req, res) => {
  try {
    const db = getDb(req);
    await db.execute({
      sql: "DELETE FROM resumes WHERE id = ?",
      args: [req.params.id]
    });
    res.json({ success: true });
  } catch (error: any) {
    console.error("Delete Resume Error:", error);
    const status = error.message.includes('credentials missing') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
});

export default app;
