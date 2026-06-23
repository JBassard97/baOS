import { emitFileSystemChanged } from "../events/eventBus";

async function getParentAndName(path: string) {
    const root = await navigator.storage.getDirectory();

    const segments = path.split("/").filter(Boolean);
    const name = segments.pop();

    if (!name) {
        throw new Error(`Invalid path: "${path}"`);
    }

    let parent: FileSystemDirectoryHandle = root;

    for (const segment of segments) {
        parent = await parent.getDirectoryHandle(segment);
    }

    return { parent, name };
}

async function copyDirectory(
    source: FileSystemDirectoryHandle,
    destination: FileSystemDirectoryHandle
) {
    for await (const [name, handle] of source.entries()) {
        if (handle.kind === "file") {
            const sourceFile = await source.getFileHandle(name);
            const file = await (await sourceFile.getFile()).arrayBuffer();

            const destFile = await destination.getFileHandle(name, {
                create: true,
            });

            const writable = await destFile.createWritable();
            await writable.write(file);
            await writable.close();
        } else {
            const childDest = await destination.getDirectoryHandle(name, {
                create: true,
            });

            await copyDirectory(handle, childDest);
        }
    }
}

export async function mv(from: string, to: string) {
    const { parent: sourceParent, name: sourceName } =
        await getParentAndName(from);

    const { parent: destParent, name: destName } =
        await getParentAndName(to);

    try {
        // File move
        const sourceFile = await sourceParent.getFileHandle(sourceName);

        const file = await sourceFile.getFile();
        const data = await file.arrayBuffer();

        const destFile = await destParent.getFileHandle(destName, {
            create: true,
        });

        const writable = await destFile.createWritable();
        await writable.write(data);
        await writable.close();

        await sourceParent.removeEntry(sourceName);
    } catch {
        // Directory move
        const sourceDir =
            await sourceParent.getDirectoryHandle(sourceName);

        const destDir =
            await destParent.getDirectoryHandle(destName, {
                create: true,
            });

        await copyDirectory(sourceDir, destDir);

        await sourceParent.removeEntry(sourceName, {
            recursive: true,
        });
    }

    const result = {
        from,
        to,
        status: "ok",
    };

    emitFileSystemChanged();

    console.log("opfs mv:", result);

    return result;
}