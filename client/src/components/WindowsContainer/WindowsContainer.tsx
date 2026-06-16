import "./windowscontainer.scss";
import { useUIStore } from "../../store/useUIStore";
import { useWindowStore } from "../../store/useWindowStore";
import Window from "../Window/Window";
// import fileManagerIcon from "../../assets/icons/file-manager.svg";

export default function WindowsContainer() {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const activeWindows = useWindowStore((s) => s.activeWindows);

  return (
    <div className={`windows-container ${taskbarPosition}`}>
      {activeWindows.length > 0 &&
        activeWindows.map((window, index) => (
          <Window
            key={index}
            id={window.id}
            icon={window.icon}
            title={window.title}
            isMinimized={window.isMinimized}
            children={window.children}
          />
        ))}
      {/* <Window icon={fileManagerIcon} title="File Manager"/> */}
    </div>
  );
}
