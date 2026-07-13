import "./backgroundlayer.scss";
import { useUIStore } from "../../store";
import { useEffect, useState } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";
import { isVideoFile } from "../../helpers";

export default function BackgroundLayer() {
  const setCurrentBackground = useUIStore((s) => s.setCurrentBackground);
  const currentBackground = useUIStore((state) => state.currentBackground);
  const DEFAULT_BG_PATH = "/Images/Backgrounds/serene.png";
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!currentBackground) return;

    let objectUrl: string;
    let file: File;

    (async () => {
      try {
        file = await getFileFromPath(currentBackground);
      } catch {
        // ! Fallback when the currentBackground file is deleted
        file = await getFileFromPath(DEFAULT_BG_PATH);
        setCurrentBackground(DEFAULT_BG_PATH);
      }

      objectUrl = URL.createObjectURL(file);
      setSrc(objectUrl);
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentBackground]);

  const isVideo = isVideoFile(currentBackground);

  return (
    <div className="background-layer">
      {isVideo ? (
        <video src={src ?? undefined} autoPlay loop muted playsInline />
      ) : (
        <img src={src ?? undefined} />
      )}
    </div>
  );
}
