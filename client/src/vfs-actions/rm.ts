import { emitFileSystemChanged } from "../events/eventBus";

export async function rm(path: string) {

    const root = await navigator.storage.getDirectory();

    const segments = path.split("/").filter(Boolean);
    if (segments.length === 0) throw new Error("Invalid path");
    const targetName = segments.pop() as string;


    if (!targetName) throw new Error("Invalid path");

    let current: FileSystemDirectoryHandle = root;

    for (const segment of segments) {
        try {
            current = await current.getDirectoryHandle(segment);
        } catch {
            throw new Error(`Path not found: ${path}`);
        }
    }

    // Recursive delete function for directories
    async function deleteRecursive(
        dirHandle: FileSystemDirectoryHandle,
        parentHandle: FileSystemDirectoryHandle,
    ): Promise<void> {
        for await (const [, childHandle] of dirHandle.entries()) {
            if (childHandle.kind === "file") {
                await dirHandle.removeEntry(childHandle.name);
            } else {
                // Recurse, passing dirHandle as the new parent
                await deleteRecursive(
                    childHandle as FileSystemDirectoryHandle,
                    dirHandle,
                );
            }
        }
        // Now remove the emptied directory from its actual parent
        await parentHandle.removeEntry(dirHandle.name);
    }

    try {
        await current.getFileHandle(targetName);
        await current.removeEntry(targetName);
    } catch {
        // Not a file, try directory
        try {
            const targetHandle = await current.getDirectoryHandle(targetName);
            await deleteRecursive(targetHandle, current);
        } catch {
            throw new Error(`Path not found: ${path}`);
        }
    }

    const result = {
        path,
        status: "ok",
    };

    emitFileSystemChanged();

    console.log("opfs rm:", result);

    return result;
}