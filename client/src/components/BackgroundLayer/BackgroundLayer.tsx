import "./backgroundlayer.scss";
import { useUIStore } from "../../store";
import { useEffect, useState } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";
import { isVideoFile } from "../../helpers";

export default function BackgroundLayer() {
  const currentBackground = useUIStore((state) => state.currentBackground);

  const [src, setSrc] = useState<string>("/Images/Backgrounds/serene.png");

  useEffect(() => {
    if (!currentBackground) return;

    let objectUrl: string;

    (async () => {
      const file = await getFileFromPath(currentBackground);
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
        <video src={src} autoPlay loop muted playsInline />
      ) : (
        <img src={src} />
      )}
    </div>
  );
}
