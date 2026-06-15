import "./window.scss";
import { useUIStore } from "../../store/useUIStore";
import { useState } from "react";
import fullscreenIcon from "../../assets/icons/fullscreen.svg";
import exitFullscreenIcon from "../../assets/icons/exit-fullscreen.svg";
import closeIcon from "../../assets/icons/close-x.svg";
import minimizeIcon from "../../assets/icons/minimize.svg";

interface WindowProps {
  icon: string;
  title: string;
}

export default function Window({ icon, title }: WindowProps) {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  return (
    <div
      className={`window ${taskbarPosition} ${isFullScreen ? "fullscreen" : ""}`}
    >
      <div className="window-title-bar">
        <div className="window-info">
          <div className="window-icon">
            <img src={icon} />
          </div>
          <p className="window-title">{title}</p>
        </div>

        <div className="window-actions">
          <div className="window-minimize">
            <img src={minimizeIcon} />
          </div>
          <div
            className="window-fullscreen"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            <img src={isFullScreen ? exitFullscreenIcon : fullscreenIcon} />
          </div>
          <div className="window-close">
            <img src={closeIcon} />
          </div>
        </div>
      </div>

      <div className="window-main"></div>
    </div>
  );
}
