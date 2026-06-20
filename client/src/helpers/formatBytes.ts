export function formatBytes(bytes: number): string {
    if (bytes == 0) return "0B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];

    const i = Math.min(
        Math.floor(Math.log(bytes) / Math.log(k)),
        sizes.length - 1
    );

    const value = bytes / Math.pow(k, i);

    const formatted =
        i === 0
            ? value.toString()
            : value.toFixed(1);

    return `${formatted}${sizes[i]}`;
}