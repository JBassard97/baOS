import "./imageviewer.scss";
import { useState, useEffect } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";

export default function ImageViewer({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!startFilePath) return;
    loadImage(startFilePath);
  }, [startFilePath]);

  async function loadImage(filePath: string) {
    if (!filePath) return;
    try {
      const file = await getFileFromPath(filePath);
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="image-viewer">
      <div className="file-name-display">
        {fileName
          ? fileName
          : startFilePath !== null && fileName === null
            ? "Loading..."
            : ""}
      </div>
      <div className="image-container">
        <img src={imageSrc ?? ""} />
      </div>
      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
