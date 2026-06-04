const DEFAULT_DIRS = [
    "Desktop",
    "Documents",
    "Images",
    "Videos",
    "Music",
];

export async function ensureOpfsExists() {
    const root = await navigator.storage.getDirectory();

    await Promise.all(
        DEFAULT_DIRS.map((dir) =>
            root.getDirectoryHandle(dir, {
                create: true,
            })
        )
    );

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