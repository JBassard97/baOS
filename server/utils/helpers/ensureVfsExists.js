import fs from "fs/promises";

export const ensureVfsExists = async (ROOT) => { await fs.mkdir(ROOT, { recursive: true }) };
