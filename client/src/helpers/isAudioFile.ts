export const isAudioFile = (fileName: string): boolean => {
    return /\.(mp3|wav|ogg|m4a|opus|weba)$/i.test(fileName);
};