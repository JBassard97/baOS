export const eventBus = new EventTarget();

export function emitFileSystemChanged() {
    eventBus.dispatchEvent(new Event("filesystem-changed"));
}