import { useSystemStore } from "../store/useSystemStore";
import { emitFileSystemChanged } from "../events/eventBus";

export async function mkdir(path: string) {
    const backendAvailable = useSystemStore.getState().backendAvailable;

    // -------------------------
    // BACKEND MODE
    // -------------------------
    if (backendAvailable) {
        const res = await fetch("/vfs-actions/mkdir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                path,
            }),
        });

        if (!res.ok) {
            throw new Error("Backend mkdir failed");
        }

        const data = await res.json();

        console.log("backend mkdir:", data);

        return data;
    }

    // -------------------------
    // OPFS MODE
    // -------------------------
    const root = await navigator.storage.getDirectory();

    const segments = path.split("/").filter(Boolean);

    let current: FileSystemDirectoryHandle = root;

    for (const segment of segments) {
        current = await current.getDirectoryHandle(segment, {
            create: true,
        });
    }

    const result = {
        path,
        status: "ok",
    };

    emitFileSystemChanged();

    console.log("opfs mkdir:", result);

    return result;
}