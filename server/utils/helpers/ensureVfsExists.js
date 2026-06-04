import fs from "fs/promises";
import path from "path";

const DEFAULT_DIRS = ["Desktop", "Documents", "Images", "Videos", "Music"];

export const ensureVfsExists = async (ROOT) => {
  await fs.mkdir(ROOT, { recursive: true });

  await Promise.all(
    DEFAULT_DIRS.map((dir) =>
      fs.mkdir(path.join(ROOT, dir), { recursive: true }),
    ),
  );

  const desktopPath = path.join(ROOT, "Desktop");

  await fs.mkdir(path.join(desktopPath, "QuickAccess"), {
    recursive: true,
  });

  await fs.writeFile(
    path.join(desktopPath, "README.md"),
    `# Welcome

Welcome to your WebOS desktop.

## Getting Started

- Use the Desktop folder to store files and shortcuts.
- The QuickAccess folder contains frequently used items.
- Documents is intended for general files.
- Images is intended for pictures and graphics.
- Videos is intended for video files.
- Music is intended for audio files.

## Notes

All files are stored locally using the virtual file system (VFS). Data persists between sessions unless the storage directory is removed.

Enjoy your desktop experience!
`,
    "utf8",
  );

  console.log("VFS Ensured and Structured");
};
