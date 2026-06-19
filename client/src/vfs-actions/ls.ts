import { useSystemStore } from "../store/useSystemStore";
import { isImageFile } from "../helpers/isImageFile";
import { isVideoFile } from "../helpers/isVideoFile";

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
        const entry: {
            name: string;
            type: "dir" | "file";
            size?: number;
            previewUrl?: string;
            previewType?: "image" | "video";
        } = {
            name,
            type: handle.kind === "directory" ? "dir" : "file",
        };

        if (handle.kind === "file") {
            const fileHandle = handle as FileSystemFileHandle;
            const file = await fileHandle.getFile();

            entry.size = file.size;

            if (isImageFile(name) || isVideoFile(name)) {
                const blobUrl = URL.createObjectURL(file);

                entry.previewUrl = blobUrl;
                entry.previewType = isVideoFile(name) ? "video" : "image";
            }
        }

        entries.push(entry);
    }

    console.log("opfs ls:", { path, entries })

    return {
        path,
        entries,
    };
}