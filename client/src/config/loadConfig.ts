import { useUIStore } from "../store/useUIStore";
import type { TaskbarPosition } from "../types/TaskbarPosition";

interface config {
    taskbarPosition: TaskbarPosition
}

export function loadConfig(config: config): void {
    const setTaskbarPosition = useUIStore((state) => state.setTaskbarPosition);
    setTaskbarPosition(config.taskbarPosition);

}