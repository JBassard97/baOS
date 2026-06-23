import express from "express";
import open from "open";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

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

// Serve built client — must come after all util routes
app.use(express.static(path.resolve(__dirname, "../client/dist")));

// Catch-all for client-side routing
app.get("/{*path}", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // open(`http://localhost:${PORT}`);
});
