import type { TaskbarPosition } from "../types/TaskbarPosition";

export const isHorizontal = (taskbarPosition: TaskbarPosition): boolean =>
    taskbarPosition === "bottom" || taskbarPosition === "top";