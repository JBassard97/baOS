import { isImageFile, isVideoFile } from "../helpers";

export async function ls(path: string) {
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