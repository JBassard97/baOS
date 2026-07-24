import baosIcon from "../assets/icons/baosNeon.png";

export async function sendNotification(
    title: string,
    options: NotificationOptions = {}
): Promise<boolean> {
    const notificationOptions: NotificationOptions = {
        icon: baosIcon,
        badge: baosIcon,
        ...options,
    };

    if (!("Notification" in window)) {
        console.warn("[sendNotification] Notification API is unavailable in this browser.");
        return false;
    }

    if (Notification.permission === "denied") {
        console.warn(
            "[sendNotification] Notification permission is denied. The browser will not show a notification.",
            { title, options },
        );
        return false;
    }

    if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        console.info("[sendNotification] Notification permission result:", permission);

        if (permission !== "granted") {
            return false;
        }
    }

    const notification = new Notification(title, notificationOptions);
    console.info("[sendNotification] Notification created.", notification);

    return true;
}