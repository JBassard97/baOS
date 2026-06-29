export async function getFileFromPath(path: string): Promise<File> {
    const root = await navigator.storage.getDirectory();

    const parts = path
        .split("/")
        .filter(Boolean);

    const fileName = parts.pop();

    if (!fileName) {
        throw new Error("Invalid path");
    }

    let currentDir = root;

    for (const dirName of parts) {
        currentDir = await currentDir.getDirectoryHandle(dirName);
    }

    const fileHandle = await currentDir.getFileHandle(fileName);

    return await fileHandle.getFile();
}