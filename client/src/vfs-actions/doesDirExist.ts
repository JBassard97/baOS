// doesDirExist.ts

export async function doesDirExist(path: string): Promise<boolean> {
    try {
        const root = await navigator.storage.getDirectory();

        const parts = path
            .split("/")
            .filter(Boolean);

        let currentDir = root;

        for (const part of parts) {
            currentDir = await currentDir.getDirectoryHandle(part);
        }

        return true;
    } catch {
        return false;
    }
}