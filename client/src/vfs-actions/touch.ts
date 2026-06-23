import { emitFileSystemChanged } from "../events/eventBus";

export async function touch(path: string, content?: string | ArrayBuffer) {
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