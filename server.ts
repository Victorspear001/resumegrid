import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@libsql/client";
import path from "path";

let dbClient: ReturnType<typeof createClient> | null = null;

function getDb() {
  if (!dbClient) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url || !authToken) {
      throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required');
    }
    dbClient = createClient({ url, authToken });
  }
  return dbClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Initialize DB Schema
  app.post("/api/init-db", async (req, res) => {
    try {
      const db = getDb();
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
      res.status(500).json({ error: error.message });
    }
  });

  // Logo API
  app.get("/api/settings/logo", async (req, res) => {
    try {
      const db = getDb();
      const result = await db.execute({
        sql: "SELECT value FROM settings WHERE key = 'logo'",
        args: []
      });
      if (result.rows.length === 0) {
        return res.json({ logo: null });
      }
      res.json({ logo: result.rows[0].value });
    } catch (error: any) {
      console.error("Get Logo Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/settings/logo", async (req, res) => {
    try {
      const db = getDb();
      const { logo } = req.body;
      if (!logo) {
        return res.status(400).json({ error: "Logo data is required" });
      }

      await db.execute({
        sql: "INSERT OR REPLACE INTO settings (key, value) VALUES ('logo', ?)",
        args: [logo]
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Save Logo Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get all resumes
  app.get("/api/resumes", async (req, res) => {
    try {
      const db = getDb();
      const result = await db.execute("SELECT id, title, created_at, updated_at FROM resumes ORDER BY updated_at DESC");
      res.json(result.rows);
    } catch (error: any) {
      console.error("Get Resumes Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific resume
  app.get("/api/resumes/:id", async (req, res) => {
    try {
      const db = getDb();
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
      res.status(500).json({ error: error.message });
    }
  });

  // Save (Create or Update) a resume
  app.post("/api/resumes", async (req, res) => {
    try {
      const db = getDb();
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
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a resume
  app.delete("/api/resumes/:id", async (req, res) => {
    try {
      const db = getDb();
      await db.execute({
        sql: "DELETE FROM resumes WHERE id = ?",
        args: [req.params.id]
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Delete Resume Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
