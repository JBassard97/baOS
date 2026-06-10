import { create } from "zustand";
import type { FileEntry } from "../interfaces/FileEntry";

interface CreatingDesktopEntry {
    isCreatingDesktopEntry: boolean;
    type: "file" | "dir" | null;
}

interface DesktopContextMenu {
    visible: boolean;
    x: number;
    y: number;
    entry: string | null
}

type DesktopStore = {
    selectedEntry: null | string;
    setSelectedEntry: (value: string | null) => void;

    contextMenuEntry: null | string;
    setContextMenuEntry: (entry: string | null) => void;

    desktopEntries: FileEntry[];
    setDesktopEntries: (value: FileEntry[]) => void;

    creatingDesktopEntry: CreatingDesktopEntry;
    setCreatingDesktopEntry: (value: CreatingDesktopEntry) => void;

    desktopContextMenu: DesktopContextMenu;
    setDesktopContextMenu: (value: DesktopContextMenu) => void;
};

export const useDesktopStore = create<DesktopStore>((set) => ({
    selectedEntry: null,
    contextMenuEntry: null,
    desktopEntries: [],
    creatingDesktopEntry: { isCreatingDesktopEntry: false, type: null },
    desktopContextMenu: { visible: false, x: 0, y: 0, entry: null },

    setSelectedEntry: (value) =>
        set({ selectedEntry: value }),
    setContextMenuEntry: (value) => set({ contextMenuEntry: value }),
    setDesktopEntries: (value) => set({ desktopEntries: value }),
    setCreatingDesktopEntry: (value) => set({ creatingDesktopEntry: value }),
    setDesktopContextMenu: (value) => set({ desktopContextMenu: value })
}));