import "./backgroundlayer.scss";
import { useUIStore } from "../../store";
import { useEffect, useState } from "react";

export default function BackgroundLayer() {
  const currentBackground = useUIStore((state) => state.currentBackground);

  const [src, setSrc] = useState<string>("serene.png");

  useEffect(() => {
    if (!currentBackground) return;

    let objectUrl: string;

    (async () => {
      const root = await navigator.storage.getDirectory();

      const images = await root.getDirectoryHandle("Images");
      const backgrounds = await images.getDirectoryHandle("Backgrounds");

      console.log("currentBackground:", currentBackground);
      const fileHandle = await backgrounds.getFileHandle(currentBackground);
      const file = await fileHandle.getFile();

      objectUrl = URL.createObjectURL(file);
      setSrc(objectUrl);
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentBackground]);

  const isVideo = /\.(mp4|webm|ogg)$/i.test(currentBackground);

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
