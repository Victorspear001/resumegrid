import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.TURSO_DATABASE_URL;
const dbAuthToken = process.env.TURSO_AUTH_TOKEN;

let turso: ReturnType<typeof createClient> | null = null;

if (dbUrl && dbAuthToken) {
  try {
    turso = createClient({
      url: dbUrl,
      authToken: dbAuthToken,
    });
    
    // Initialize table
    turso.execute(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        data TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).then(() => {
      console.log("Turso database connected and table initialized.");
    }).catch(err => {
      console.error("Failed to create table. Please check your TURSO_AUTH_TOKEN.");
      console.error(err);
      // If auth fails, disable the client so we don't keep getting 401s
      turso = null; 
    });
  } catch (err) {
    console.error("Failed to initialize Turso client:", err);
  }
} else {
  console.warn("TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is missing. Database features will be disabled.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/resumes", async (req, res) => {
    if (!turso) return res.status(500).json({ error: "Database not configured" });
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ error: "userId required" });

    try {
      const result = await turso.execute({
        sql: "SELECT id, title, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC",
        args: [userId]
      });
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  app.get("/api/resumes/:id", async (req, res) => {
    if (!turso) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    const userId = req.query.userId as string;

    try {
      const result = await turso.execute({
        sql: "SELECT * FROM resumes WHERE id = ? AND user_id = ?",
        args: [id, userId]
      });
      if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch resume" });
    }
  });

  app.post("/api/resumes", async (req, res) => {
    if (!turso) return res.status(500).json({ error: "Database not configured" });
    const { id, userId, title, data } = req.body;
    
    if (!id || !userId || !data) return res.status(400).json({ error: "Missing required fields" });

    try {
      await turso.execute({
        sql: `INSERT INTO resumes (id, user_id, title, data, updated_at) 
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(id) DO UPDATE SET 
                title = excluded.title,
                data = excluded.data,
                updated_at = CURRENT_TIMESTAMP`,
        args: [id, userId, title || "Untitled Resume", JSON.stringify(data)]
      });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save resume" });
    }
  });

  app.delete("/api/resumes/:id", async (req, res) => {
    if (!turso) return res.status(500).json({ error: "Database not configured" });
    const { id } = req.params;
    const userId = req.query.userId as string;

    try {
      await turso.execute({
        sql: "DELETE FROM resumes WHERE id = ? AND user_id = ?",
        args: [id, userId]
      });
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete resume" });
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
