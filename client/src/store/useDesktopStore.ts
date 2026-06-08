import { create } from "zustand";
import type { FileEntry } from "../interfaces/FileEntry";

type DesktopStore = {
    selectedEntry: null | string;
    setSelectedEntry: (value: string | null) => void;

    contextMenuEntry: null | string;
    setContextMenuEntry: (entry: string | null) => void;

    desktopEntries: FileEntry[]
    setDesktopEntries: (value: FileEntry[]) => void;
};

export const useDesktopStore = create<DesktopStore>((set) => ({
    selectedEntry: null,
    contextMenuEntry: null,
    desktopEntries: [],

    setSelectedEntry: (value) =>
        set({ selectedEntry: value }),
    setContextMenuEntry: (value) => set({ contextMenuEntry: value }),
    setDesktopEntries: (value) => set({ desktopEntries: value })
}));