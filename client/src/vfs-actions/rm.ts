import { useSystemStore } from "../store/useSystemStore";

export async function rm(path: string) {
    const backendAvailable = useSystemStore.getState().backendAvailable;

    // -------------------------
    // BACKEND MODE
    // -------------------------
    if (backendAvailable) {
        const res = await fetch("/vfs-actions/rm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                path,
            }),
        });

        if (!res.ok) throw new Error("Backend rm failed");

        const data = await res.json();
        console.log("backend rm:", data);

        return data;
    }

    // -------------------------
    // OPFS MODE
    // -------------------------
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
        handle: FileSystemFileHandle | FileSystemDirectoryHandle,
    ): Promise<void> {
        if (handle.kind === "file") {
            // It's a file, just delete it
            await current.removeEntry(handle.name);
        } else if (handle.kind === "directory") {
            // It's a directory, delete contents first
            const dirHandle = handle as FileSystemDirectoryHandle;
            for await (const entry of dirHandle.entries()) {
                const [, childHandle] = entry;
                if (childHandle.kind === "file") {
                    await dirHandle.removeEntry(childHandle.name);
                } else {
                    // Recursively delete subdirectories
                    await deleteRecursive(childHandle);
                    await dirHandle.removeEntry(childHandle.name);
                }
            }
            // Delete the now-empty directory
            await current.removeEntry(targetName);
        }
    }

    try {
        await current.getFileHandle(targetName);
        await current.removeEntry(targetName);
    } catch {
        // Not a file, try directory
        try {
            const targetHandle = await current.getDirectoryHandle(targetName);
            await deleteRecursive(targetHandle);
        } catch {
            throw new Error(`Path not found: ${path}`);
        }
    }

    const result = {
        path,
        status: "ok",
    };

    console.log("opfs rm:", result);

    return result;
}