import "./window.scss";
import { useUIStore, useWindowStore } from "../../store";
import { useState, useEffect, type ReactNode } from "react";
import fullscreenIcon from "../../assets/icons/fullscreen.svg";
import exitFullscreenIcon from "../../assets/icons/exit-fullscreen.svg";
import closeIcon from "../../assets/icons/close-x.svg";
import minimizeIcon from "../../assets/icons/minimize.svg";
import left50 from "../../assets/icons/left-50.svg";
import right50 from "../../assets/icons/right-50.svg";
import top50 from "../../assets/icons/top-50.svg";
import bottom50 from "../../assets/icons/bottom-50.svg";
import type { TaskbarPosition } from "../../types/TaskbarPosition";

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
  const [moveMenuOpen, setMoveMenuOpen] = useState<boolean>(false);
  const [halfPortion, setHalfPortion] = useState<TaskbarPosition | null>(null);

  useEffect(() => {
    console.log("moveMenuOpen:", moveMenuOpen);
  }, [moveMenuOpen]);

  useEffect(() => {
    if (!isFocused) setMoveMenuOpen(false);
  }, [isFocused]);

  return (
    <div
      className={`window ${taskbarPosition} ${isFullScreenLocal ? "fullscreen" : ""} ${isMinimized ? "minimized" : ""} ${isFocused ? "focused" : ""}`}
      style={{
        top: isFullScreenLocal || halfPortion === "top" ? 0 : "",
        bottom: halfPortion === "bottom" ? 0 : "",
        left: isFullScreenLocal || halfPortion === "left" ? 0 : "",
        right: halfPortion === "right" ? 0 : "",

        width: isFullScreenLocal
          ? "100%"
          : ["left", "right"].includes(String(halfPortion))
            ? "50%"
            : ["top", "bottom"].includes(String(halfPortion))
              ? "100%"
              : "",
        height: isFullScreenLocal
          ? "100%"
          : ["left", "right"].includes(String(halfPortion))
            ? "100%"
            : ["top", "bottom"].includes(String(halfPortion))
              ? "50%"
              : "",

        zIndex: isFocused ? activeWindows.length : index,
      }}
      onClick={() => {
        focusWindow(id);
        setMoveMenuOpen(false);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
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
            onContextMenu={(e) => {
              e.preventDefault();
              setMoveMenuOpen(true);
            }}
          >
            <img
              src={isFullScreenLocal ? exitFullscreenIcon : fullscreenIcon}
            />
            {moveMenuOpen && (
              <div
                className="move-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoveMenuOpen(false);
                  setIsFullScreen(false);
                }}
              >
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("top");
                  }}
                >
                  <img src={top50} />
                </div>
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("right");
                  }}
                >
                  <img src={right50} />
                </div>
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("left");
                  }}
                >
                  <img src={left50} />
                </div>
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("bottom");
                  }}
                >
                  <img src={bottom50} />
                </div>
              </div>
            )}
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
