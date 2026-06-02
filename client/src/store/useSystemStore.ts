import { create } from "zustand";

type SystemStore = {
    backendAvailable: boolean | null;
    setBackendAvailable: (value: boolean) => void;
};

export const useSystemStore = create<SystemStore>((set) => ({
    backendAvailable: null,

    setBackendAvailable: (value) =>
        set({ backendAvailable: value }),
}));