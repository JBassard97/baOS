import serene from "../assets/backgrounds/serene.png";

const DEFAULT_DIRS = [
    "Desktop",
    "Documents",
    "Images",
    "Videos",
    "Music",
];

async function fileFromAsset(url: string, filename: string) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
}

export async function ensureOpfsExists() {
    const root = await navigator.storage.getDirectory();

    await Promise.all(
        DEFAULT_DIRS.map((dir) =>
            root.getDirectoryHandle(dir, {
                create: true,
            })
        )
    );

    const images = await root.getDirectoryHandle("Images", { create: true });

    const backgrounds = await images.getDirectoryHandle("Backgrounds", {
        create: true,
    });

    // -----------------------------
    // SEED DEFAULT WALLPAPER
    // -----------------------------
    const defaultWallpaperName = "serene.png";

    try {
        await backgrounds.getFileHandle(defaultWallpaperName);
    } catch {
        const file = await fileFromAsset(serene, defaultWallpaperName);

        const handle = await backgrounds.getFileHandle(defaultWallpaperName, {
            create: true,
        });

        const writable = await handle.createWritable();
        await writable.write(file);
        await writable.close();

        console.log("Seeded default wallpaper: serene.png");
    }

    const desktop = await root.getDirectoryHandle("Desktop", {
        create: true,
    });

    await desktop.getDirectoryHandle("QuickAccess", {
        create: true,
    });

    const readme = await desktop.getFileHandle("README.md", {
        create: true,
    });

    const writable = await readme.createWritable();

    await writable.write(`# Welcome

Welcome to your WebOS desktop.

## Getting Started

- Use the Desktop folder to store files and shortcuts.
- The QuickAccess folder contains frequently used items.
- Documents is intended for general files.
- Images is intended for pictures and graphics.
- Videos is intended for video files.
- Music is intended for audio files.

## Notes

All files are stored locally using the browser's Origin Private File System (OPFS). Data persists between sessions unless site storage is cleared.

Enjoy your desktop experience!
`);

    await writable.close();

    console.log("OPFS Ensured and Structured");
    return root;
}