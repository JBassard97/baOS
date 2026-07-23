// import baosIcon from "../assets/icons/baosNeon.png";

export async function sendNotification(
    title: string,
    options: NotificationOptions = {}
) {
    const notificationOptions: NotificationOptions = {
        // icon: baosIcon,
        ...options,
    };

    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission === "granted") {
        new Notification(title, notificationOptions);
        return;
    }

    if (Notification.permission === "denied") {
        return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
        new Notification(title, notificationOptions);
    }
}