import { ensureOpfsExists } from "./ensureOpfsExists";

export async function resetOpfs() {
    const root = await navigator.storage.getDirectory();

    for await (const [name] of root.entries()) {
        await root.removeEntry(name, { recursive: true });
    }

    await ensureOpfsExists();
    console.log("OPFS reset complete")
}