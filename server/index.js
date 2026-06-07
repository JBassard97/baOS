import express from "express";
import open from "open";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { ensureVfsExists } from "./utils/helpers/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Base directory for all user files
const ROOT = path.resolve(__dirname, "./vfs");

// Resolve a VFS path to a real path, preventing directory traversal
const resolve = (vfsPath) => {
  const full = path.resolve(ROOT, vfsPath);
  if (!full.startsWith(ROOT)) {
    throw new Error("Access denied");
  }
  return full;
};

app.use(cors());
app.use(express.json());
app.use(express.raw({ type: "*/*", limit: "50mb" }));

app.get("/vfs-actions/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.get("/vfs-actions/ls", async (req, res) => {
  try {
    const dir = req.query.path || "/";

    const fullPath = resolve(dir);

    const entries = await fs.readdir(fullPath, { withFileTypes: true });

    const result = entries.map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? "dir" : "file",
    }));

    res.json({
      path: dir,
      entries: result,
    });
  } catch (err) {
    console.error("LS ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/vfs-actions/touch", async (req, res) => {
  try {
    const { path: vfsPath, content } = req.body;

    console.log("TOUCH REQUEST BODY:", req.body);

    // ❌ BLOCK invalid paths
    if (!vfsPath || vfsPath === "/" || vfsPath.endsWith("/")) {
      return res.status(400).json({
        error: "Invalid file path. Must include a filename.",
      });
    }

    const fullPath = resolve(vfsPath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    await fs.writeFile(fullPath, content ?? "", "utf-8");

    console.log("VFS PATH:", vfsPath);
    console.log("RESOLVED:", fullPath);
    console.log("DIRNAME:", path.dirname(fullPath));

    res.json({
      status: "ok",
      path: vfsPath,
    });
  } catch (err) {
    console.error("TOUCH ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/vfs-actions/mkdir", async (req, res) => {
  try {
    const { path: vfsPath } = req.body;

    console.log("MKDIR REQUEST BODY:", req.body);

    if (!vfsPath || !vfsPath.startsWith("/")) {
      return res.status(400).json({
        error: "Invalid directory path",
      });
    }

    const fullPath = resolve(vfsPath);

    await fs.mkdir(fullPath, {
      recursive: true,
    });

    console.log("MKDIR PATH:", vfsPath);
    console.log("RESOLVED:", fullPath);

    res.json({
      status: "ok",
      path: vfsPath,
    });
  } catch (err) {
    console.error("MKDIR ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// Serve built client — must come after VFS routes
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Catch-all for client-side routing
app.get("/{*path}", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

// Ensure vfs directory exists then start
await ensureVfsExists(ROOT);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // open(`http://localhost:${PORT}`);
});
