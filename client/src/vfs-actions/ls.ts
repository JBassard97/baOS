import { useSystemStore } from "../store/useSystemStore";

export async function ls(path: string) {
    const backendAvailable = useSystemStore.getState().backendAvailable;

    // -------------------------
    // BACKEND MODE
    // -------------------------
    if (backendAvailable) {
        const res = await fetch(`/vfs-actions/ls?path=.${encodeURIComponent(path)}`);

        if (!res.ok) throw new Error("Backend ls failed");

        const data = await res.json()
        console.log(data)
        return data;
    }

    // -------------------------
    // OPFS MODE (fallback)
    // -------------------------
    const root = await navigator.storage.getDirectory();

    const segments = path.split("/").filter(Boolean);

    let current: FileSystemDirectoryHandle = root;

    for (const segment of segments) {
        current = await current.getDirectoryHandle(segment);
    }

    const entries = [];

    for await (const [name, handle] of current.entries()) {
        entries.push({
            name,
            type: handle.kind === "directory" ? "dir" : "file",
        });
    }

    console.log("opfs ls:", { path, entries })

    return {
        path,
        entries,
    };
}