import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaskbarPosition } from "../types/TaskbarPosition";

type UIStore = {
    taskbarPosition: TaskbarPosition;
    setTaskbarPosition: (position: TaskbarPosition) => void;

    currentBackground: string;
    setCurrentBackground: (src: string) => void;
};

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            taskbarPosition: "bottom",
            currentBackground: "serene.png",

            setTaskbarPosition: (position) =>
                set({ taskbarPosition: position }),
            setCurrentBackground: (src) => set({ currentBackground: src })
        }),
        {
            name: "ui-store",
        }
    )
);