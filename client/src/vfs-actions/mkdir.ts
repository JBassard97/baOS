import { emitFileSystemChanged } from "../events/eventBus";

export async function mkdir(path: string) {
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