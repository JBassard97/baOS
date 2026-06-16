import type { ReactNode } from "react";
import { create } from "zustand";

export interface AppWindow {
    id: string;
    children: ReactNode | null;
    isMinimized: boolean;
    title: string;
    icon: string;
}

type WindowStore = {
    activeWindows: AppWindow[];
    setActiveWindows: (value: AppWindow[]) => void;
    addActiveWindow: (window: AppWindow) => void;
    removeActiveWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
};

export const useWindowStore = create<WindowStore>((set) => ({
    activeWindows: [],

    setActiveWindows: (value) => set({ activeWindows: value }),

    addActiveWindow: (window) =>
        set((state) => ({
            activeWindows: [...state.activeWindows, window],
        })),

    removeActiveWindow: (id) =>
        set((state) => ({
            activeWindows: state.activeWindows.filter(
                (window) => window.id !== id
            ),
        })),

    minimizeWindow: (id) =>
        set((state) => ({
            activeWindows: state.activeWindows.map((window) =>
                window.id === id
                    ? { ...window, isMinimized: true }
                    : window
            ),
        })),

    restoreWindow: (id) =>
        set((state) => ({
            activeWindows: state.activeWindows.map((window) =>
                window.id === id
                    ? { ...window, isMinimized: false }
                    : window
            ),
        })),
}));