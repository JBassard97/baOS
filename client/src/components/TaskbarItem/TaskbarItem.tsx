import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";
import { useUIStore, useWindowStore } from "../../store";
import "./taskbaritem.scss";
import type { ReactNode } from "react";

interface WindowProps {
  icon: string;
  title: string;
  children: ReactNode | null;
  isMinimized?: boolean;
  isFullscreen?: boolean;
  dontShowTooltip?: boolean;
}

export default function TaskbarItem({
  icon,
  title,
  children,
  isMinimized = false,
  isFullscreen = false,
  dontShowTooltip = false,
}: WindowProps) {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const setStartMenuOpen = useUIStore((s) => s.setStartMenuOpen);
  const addActiveWindow = useWindowStore((s) => s.addActiveWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const activeWindows = useWindowStore((s) => s.activeWindows);

  const existingWindows = activeWindows.filter(
    (window) => window.title === title,
  );

  return (
    <TooltipProvider
      text={title}
      taskbarPosition={taskbarPosition}
      dontShowTooltip={dontShowTooltip}
    >
      <div
        className={`taskbar-item ${
          existingWindows.some((window) => window.isMinimized)
            ? "minimized-active"
            : existingWindows.length > 0
              ? "active"
              : ""
        }`}
        onClick={() => {
          if (existingWindows.length > 0) {
            existingWindows.forEach((window) => {
              if (window.isMinimized) {
                restoreWindow(window.id);
                focusWindow(window.id);
              } else {
                minimizeWindow(window.id);
              }
            });
          }

          if (existingWindows.length === 0) {
            addActiveWindow({
              id: String(activeWindows.length),
              icon,
              children,
              title,
              isMinimized,
              isFullscreen,
              isFocused: true,
            });
            setStartMenuOpen(false);
          }
        }}
      >
        <img src={icon} />
        {existingWindows.length > 0 && (
          <div className="existing-windows-display">
            {existingWindows.length}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
