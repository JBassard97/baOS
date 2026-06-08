import { useUIStore } from "../store/useUIStore";
import type { TaskbarPosition } from "../types/TaskbarPosition";

interface config {
    taskbarPosition: TaskbarPosition
    currentBackground: string
}

export function loadConfig(config: config): void {
    const taskbarPosition = useUIStore((state) => state.taskbarPosition);
    const setTaskbarPosition = useUIStore((state) => state.setTaskbarPosition);
    if (!taskbarPosition) setTaskbarPosition(config.taskbarPosition);

    const currentBackground = useUIStore((state) => state.currentBackground);
    const setCurrentBackground = useUIStore((state) => state.setCurrentBackground);
    if (!currentBackground) setCurrentBackground(config.currentBackground);
}