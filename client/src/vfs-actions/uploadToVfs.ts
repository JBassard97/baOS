import { touch } from "./touch";
import { mkdir } from "./mkdir";
import { getValidFileName } from "../helpers";

/**
 * Recursively uploads a File or FileSystemDirectoryEntry into the VFS
 * at the given parent path.
 */

// Wraps the legacy FileSystemEntry API in promises
const readEntries = (reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> =>
    new Promise((res, rej) => reader.readEntries(res, rej));

const getFile = (entry: FileSystemFileEntry): Promise<File> =>
    new Promise((res, rej) => entry.file(res, rej));

async function uploadEntry(entry: FileSystemEntry, parentPath: string): Promise<void> {
    if (entry.isFile) {
        const file = await getFile(entry as FileSystemFileEntry);
        const validName = getValidFileName(file.name);
        const filePath = `${parentPath}${validName}`;
        const content = await file.arrayBuffer();

        await touch(filePath, content); // pass content if your touch supports it
    } else if (entry.isDirectory) {
        const dirPath = `${parentPath}${entry.name}/`;
        await mkdir(dirPath);

        const reader = (entry as FileSystemDirectoryEntry).createReader();
        let batch: FileSystemEntry[];

        // readEntries only returns up to 100 entries at a time — must loop
        do {
            batch = await readEntries(reader);
            await Promise.all(batch.map((child) => uploadEntry(child, dirPath)));
        } while (batch.length > 0);
    }
}

export async function uploadFilesToVFS(parentPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;

        input.onchange = async () => {
            const items = input.files;
            if (!items || items.length === 0) return resolve();
            try {
                await Promise.all(
                    Array.from(items).map(async (file) => {
                        const validName = getValidFileName(file.name);
                        return touch(`${parentPath}${validName}`, await file.arrayBuffer());
                    }),
                );
                resolve();
            } catch (err) {
                reject(err);
            }
        };

        input.click();
    });
}

export async function uploadFolderToVFS(parentPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.webkitdirectory = true;

        input.onchange = async () => {
            const items = input.files;
            if (!items || items.length === 0) return resolve();
            try {
                await Promise.all(
                    Array.from(items).map(async (file) => {
                        // webkitdirectory gives relative paths like "folderName/sub/file.txt"
                        // so we use file.webkitRelativePath instead of just the name
                        const relativePath = file.webkitRelativePath || file.name;
                        return touch(`${parentPath}${relativePath}`, await file.arrayBuffer());
                    }),
                );
                resolve();
            } catch (err) {
                reject(err);
            }
        };

        input.click();
    });
}

/**
 * Preferred: uses drag-and-drop DataTransfer items which supports folders.
 * Call this from a drop handler on your entries container.
 */
export async function uploadFromDrop(
    dataTransfer: DataTransfer,
    parentPath: string,
): Promise<void> {
    const entries: FileSystemEntry[] = [];

    for (const item of Array.from(dataTransfer.items)) {
        const entry = item.webkitGetAsEntry?.();
        if (entry) entries.push(entry);
    }

    await Promise.all(entries.map((entry) => uploadEntry(entry, parentPath)));
}