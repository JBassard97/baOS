import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";
import { useUIStore } from "../../store/useUIStore";
import "./taskbaritem.scss";
import type { ReactNode } from "react";
import { useWindowStore } from "../../store/useWindowStore";

interface WindowProps {
  //   id: string;
  icon: string;
  title: string;
  children: ReactNode | null;
  isMinimized: boolean;
}

export default function TaskbarItem({
  icon,
  title,
  children,
  isMinimized,
}: WindowProps) {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const addActiveWindow = useWindowStore((s) => s.addActiveWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const activeWindows = useWindowStore((s) => s.activeWindows);

  const existingWindow = activeWindows.find((window) => window.title === title);

  return (
    <TooltipProvider text={title} taskbarPosition={taskbarPosition}>
      <div
        className={`taskbar-item ${existingWindow && existingWindow.isMinimized ? "minimized-active" : existingWindow ? "active" : ""}`}
        onClick={() => {
          if (existingWindow) {
            if (existingWindow.isMinimized) {
              restoreWindow(existingWindow.id);
            } else {
              minimizeWindow(existingWindow.id);
            }
          }

          if (!existingWindow) {
            addActiveWindow({
              id: String(activeWindows.length),
              icon: icon,
              children: children,
              title: title,
              isMinimized: isMinimized,
            });
          }
        }}
      >
        <img src={icon} />
      </div>
    </TooltipProvider>
  );
}
