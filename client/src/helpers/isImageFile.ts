export const isImageFile = (fileName: string): boolean => {
    return /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(fileName);
}