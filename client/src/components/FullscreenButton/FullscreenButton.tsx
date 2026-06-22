import "./fullscreenbutton.scss";
import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";
import fullscreenIcon from "../../assets/icons/fullscreen.svg";
import exitFullscreenIcon from "../../assets/icons/exit-fullscreen.svg";
import { useState, useEffect } from "react";
import { useUIStore } from "../../store";
import { getOrientation } from "../../helpers";

function FullscreenButton() {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const orientation = getOrientation(taskbarPosition);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(true);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const supported =
      typeof document.documentElement.requestFullscreen === "function" &&
      typeof document.exitFullscreen === "function";
    setIsFullscreenSupported(supported);

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleFullscreenToggle = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
  };

  // If the client can't fullscreen then hide the whole component
  if (!isFullscreenSupported) return null;

  return (
    <TooltipProvider
      text={`${isFullscreen ? "Exit" : "Enter"} Fullscreen`}
      taskbarPosition={taskbarPosition}
    >
      <div
        className={`fullscreen-button ${orientation}`}
        onClick={handleFullscreenToggle}
      >
        <img src={isFullscreen ? exitFullscreenIcon : fullscreenIcon} />
      </div>
    </TooltipProvider>
  );
}

export default FullscreenButton;
