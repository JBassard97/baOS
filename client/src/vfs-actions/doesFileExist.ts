// doesFileExist.ts

export async function doesFileExist(path: string): Promise<boolean> {
    try {
        const root = await navigator.storage.getDirectory();

        const parts = path.split("/").filter(Boolean);

        if (parts.length === 0) return false;

        const fileName = parts.pop()!;
        let currentDir = root;

        for (const part of parts) {
            currentDir = await currentDir.getDirectoryHandle(part);
        }

        await currentDir.getFileHandle(fileName);

        return true;
    } catch {
        return false;
    }
}