import { create } from "zustand";
import type { FileEntry } from "../interfaces/FileEntry";

type DesktopStore = {
    selectedEntry: null | string;
    setSelectedEntry: (value: string | null) => void;

    desktopEntries: FileEntry[]
    setDesktopEntries: (value: FileEntry[]) => void;
};

export const useDesktopStore = create<DesktopStore>((set) => ({
    selectedEntry: null,
    desktopEntries: [],

    setSelectedEntry: (value) =>
        set({ selectedEntry: value }),
    setDesktopEntries: (value) => set({ desktopEntries: value })
}));