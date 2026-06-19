export const isVideoFile = (fileName: string): boolean => {
    return /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i.test(fileName);
}