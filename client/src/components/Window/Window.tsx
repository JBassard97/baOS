import "./window.scss";
import { useUIStore, useWindowStore } from "../../store";
import { useState, type ReactNode } from "react";
import fullscreenIcon from "../../assets/icons/fullscreen.svg";
import exitFullscreenIcon from "../../assets/icons/exit-fullscreen.svg";
import closeIcon from "../../assets/icons/close-x.svg";
import minimizeIcon from "../../assets/icons/minimize.svg";

interface WindowProps {
  index: number;
  id: string;
  icon: string;
  title: string;
  children: ReactNode | null;
  isMinimized: boolean;
  isFullscreen: boolean;
  isFocused: boolean;
}

export default function Window({
  index,
  id,
  icon,
  title,
  children,
  isMinimized,
  isFullscreen,
  isFocused,
}: WindowProps) {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const activeWindows = useWindowStore((s) => s.activeWindows);
  const removeActiveWindow = useWindowStore((s) => s.removeActiveWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const [isFullScreenLocal, setIsFullScreen] = useState<boolean>(isFullscreen);

  return (
    <div
      className={`window ${taskbarPosition} ${isFullScreenLocal ? "fullscreen" : ""} ${isMinimized ? "minimized" : ""} ${isFocused ? "focused" : ""}`}
      style={{
        top: isFullScreenLocal ? 0 : `${index * 2}rem`,
        left: isFullScreenLocal ? 0 : `${index * 2}rem`,
        zIndex: isFocused ? activeWindows.length : index,
      }}
      onClick={() => {
        focusWindow(id);
      }}
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
            onClick={() => {
              setIsFullScreen(!isFullScreenLocal);
              focusWindow(id);
            }}
          >
            <img
              src={isFullScreenLocal ? exitFullscreenIcon : fullscreenIcon}
            />
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
