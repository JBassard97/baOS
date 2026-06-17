import type { ReactNode } from "react";
import { create } from "zustand";

export interface AppWindow {
    id: string;
    children: ReactNode | null;
    isMinimized: boolean;
    isFocused: boolean;
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
    focusWindow: (id: string) => void;
};

export const useWindowStore = create<WindowStore>((set) => ({
    activeWindows: [],

    setActiveWindows: (value) => set({ activeWindows: value }),

    addActiveWindow: (window) =>
        set((state) => ({
            activeWindows: [
                ...state.activeWindows.map((w) => ({
                    ...w,
                    isFocused: false,
                })),
                {
                    ...window,
                    isFocused: true,
                },
            ],
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
                    ? { ...window, isMinimized: true, isFocused: false }
                    : window
            ),
        })),

    restoreWindow: (id) =>
        set((state) => ({
            activeWindows: state.activeWindows.map((window) => ({
                ...window,
                isMinimized:
                    window.id === id ? false : window.isMinimized,
                isFocused: window.id === id,
            })),
        })),

    focusWindow: (id) =>
        set((state) => ({
            activeWindows: state.activeWindows.map((window) => ({
                ...window,
                isFocused: window.id === id,
            })),
        })),
}));