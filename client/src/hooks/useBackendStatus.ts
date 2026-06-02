import { useEffect } from "react";
import { useSystemStore } from "../store/useSystemStore";

export function useBackendStatus() {
    const setBackendAvailable = useSystemStore(
        (state) => state.setBackendAvailable
    );

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        async function checkBackend() {
            try {
                const response = await fetch("/vfs-actions/health", {
                    signal: AbortSignal.timeout(2000),
                });

                setBackendAvailable(response.ok);
            } catch {
                setBackendAvailable(false);
            }
        }

        // initial check immediately on boot
        checkBackend();

        // then poll every n seconds
        const n: number = 60
        interval = setInterval(checkBackend, n * 1000);

        return () => clearInterval(interval);
    }, [setBackendAvailable]);
}