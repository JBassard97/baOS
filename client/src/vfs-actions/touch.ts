import { useSystemStore } from "../store/useSystemStore";
import { emitFileSystemChanged } from "../events/eventBus";

export async function touch(path: string, content?: string) {

    const backendAvailable = useSystemStore.getState().backendAvailable;

    // -------------------------
    // BACKEND MODE
    // -------------------------
    if (backendAvailable) {
        const res = await fetch("/vfs-actions/touch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                path,
                content,
            }),
        });

        if (!res.ok) throw new Error("Backend touch failed");

        const data = await res.json();
        console.log("backend touch:", data);

        return data;
    }

    // -------------------------
    // OPFS MODE
    // -------------------------
    const root = await navigator.storage.getDirectory();

    const segments = path.split("/").filter(Boolean);
    const fileName = segments.pop();

    if (!fileName) throw new Error("Invalid path");

    let current: FileSystemDirectoryHandle = root;

    for (const segment of segments) {
        current = await current.getDirectoryHandle(segment, { create: true });
    }

    const fileHandle = await current.getFileHandle(fileName, {
        create: true,
    });

    const writable = await fileHandle.createWritable();

    await writable.write(content ?? "");

    await writable.close();

    const result = {
        path,
        status: "ok",
    };

    emitFileSystemChanged();

    console.log("opfs touch:", result);

    return result;
}