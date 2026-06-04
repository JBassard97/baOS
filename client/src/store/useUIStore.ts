import { create } from "zustand";
import { persist } from "zustand/middleware";

type TaskbarPosition = "top" | "bottom" | "left" | "right";

type UIStore = {
    taskbarPosition: TaskbarPosition;
    setTaskbarPosition: (position: TaskbarPosition) => void;
};

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            taskbarPosition: "bottom",

            setTaskbarPosition: (position) =>
                set({ taskbarPosition: position }),
        }),
        {
            name: "ui-store",
        }
    )
);