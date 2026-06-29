import "./windowscontainer.scss";
import { useUIStore, useWindowStore } from "../../store";
import Window from "../Window/Window";

export default function WindowsContainer() {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const activeWindows = useWindowStore((s) => s.activeWindows);

  return (
    <div className={`windows-container ${taskbarPosition}`}>
      {activeWindows.length > 0 &&
        activeWindows.map((window, index) => (
          <Window
            key={index}
            index={index}
            id={window.id}
            icon={window.icon}
            title={window.title}
            isMinimized={window.isMinimized}
            isFullscreen={window.isFullscreen}
            isFocused={window.isFocused}
            children={window.children}
          />
        ))}
    </div>
  );
}
