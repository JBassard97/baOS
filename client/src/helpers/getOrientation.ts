import type { TaskbarPosition } from "../types/TaskbarPosition";

export const getOrientation = (position: TaskbarPosition) => {
    return position === "top" || position === "bottom"
        ? "horizontal"
        : "vertical";
};