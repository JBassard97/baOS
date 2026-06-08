import "./backgroundlayer.scss";
import { useUIStore } from "../../store/useUIStore";

export default function BackgroundLayer() {
  const currentBackground = useUIStore((state) => state.currentBackground);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(currentBackground);

  return (
    <div className="background-layer">
      {isVideo ? (
        <video src={currentBackground} autoPlay loop muted playsInline />
      ) : (
        <img src={currentBackground} />
      )}
    </div>
  );
}
