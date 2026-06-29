export interface FileEntry {
    name: string;
    type: "dir" | "file";
    previewUrl?: string;
    previewType?: "video" | "image";
    size?: number;
}