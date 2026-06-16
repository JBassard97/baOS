import "./window.scss";
import { useUIStore } from "../../store/useUIStore";
import { useState, type ReactNode } from "react";
import fullscreenIcon from "../../assets/icons/fullscreen.svg";
import exitFullscreenIcon from "../../assets/icons/exit-fullscreen.svg";
import closeIcon from "../../assets/icons/close-x.svg";
import minimizeIcon from "../../assets/icons/minimize.svg";
import { useWindowStore } from "../../store/useWindowStore";

interface WindowProps {
  id: string;
  icon: string;
  title: string;
  children: ReactNode | null;
  isMinimized: boolean;
}

export default function Window({
  id,
  icon,
  title,
  children,
  isMinimized,
}: WindowProps) {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const removeActiveWindow = useWindowStore((s) => s.removeActiveWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  return (
    <div
      className={`window ${taskbarPosition} ${isFullScreen ? "fullscreen" : ""} ${isMinimized ? "minimized" : ""}`}
    >
      <div className="window-title-bar">
        <div className="window-info">
          <div className="window-icon">
            <img src={icon} />
          </div>
          <p className="window-title">{title}</p>
        </div>

        <div className="window-actions">
          <div
            className="window-minimize"
            onClick={() => {
              minimizeWindow(id);
            }}
          >
            <img src={minimizeIcon} />
          </div>
          <div
            className="window-fullscreen"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            <img src={isFullScreen ? exitFullscreenIcon : fullscreenIcon} />
          </div>
          <div className="window-close" onClick={() => removeActiveWindow(id)}>
            <img src={closeIcon} />
          </div>
        </div>
      </div>

      <div className="window-main">{children}</div>
    </div>
  );
}
