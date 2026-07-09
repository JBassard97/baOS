import "./videoplayer.scss";
import { useState, useEffect } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";

export default function VideoPlayer({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (!startFilePath) return;
    loadImage(startFilePath);
  }, [startFilePath]);

  async function loadImage(filePath: string) {
    if (!filePath) return;
    try {
      const file = await getFileFromPath(filePath);

      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }

      const imageUrl = URL.createObjectURL(file);
      setVideoSrc(imageUrl);
      setFileName(file.name);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="video-player">
      <div className="file-name-display">
        {fileName
          ? fileName
          : startFilePath !== null && fileName === null
            ? "Loading..."
            : ""}
      </div>
      <div className="video-container">
        <video src={videoSrc ?? ""} controls />
      </div>
      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
