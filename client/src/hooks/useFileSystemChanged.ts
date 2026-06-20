import { useEffect } from "react";
import { eventBus } from "../events/eventBus";

export function useFileSystemChanged(
    callback: () => void | Promise<void>
) {
    useEffect(() => {
        eventBus.addEventListener("filesystem-changed", callback);
        return () => {
            eventBus.removeEventListener("filesystem-changed", callback);
        }
    }, [callback])
}