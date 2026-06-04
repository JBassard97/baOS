import type { TaskbarPosition } from "../types/TaskbarPosition";

export const isHorizontal = (taskbarPosition: TaskbarPosition) =>
    taskbarPosition === "bottom" || taskbarPosition === "top";