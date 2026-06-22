import { useEffect, useState } from "react";

export function useTime(updateMs = 1000) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => {
            setNow(new Date());
        }, updateMs);

        return () => clearInterval(id);
    }, [updateMs]);

    return now;
}

