import "./fullscreenbutton.scss";
import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";
import fullscreenIcon from "../../assets/icons/fullscreen.svg";
import exitFullscreenIcon from "../../assets/icons/exit-fullscreen.svg";
import { useState, useEffect } from "react";

function FullscreenButton({
  orientation,
  taskbarPosition,
}: {
  orientation: "horizontal" | "vertical";
  taskbarPosition: "top" | "bottom" | "left" | "right";
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

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
