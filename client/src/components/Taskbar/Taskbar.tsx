import "./taskbar.scss";
import StartButton from "../StartButton/StartButton";
import SmallDateClock from "../SmallDateClock/SmallDateClock";
import FullscreenButton from "../FullscreenButton/FullscreenButton";
import TaskbarPositionSetter from "../TaskbarPositionSetter/TaskbarPositionSetter";
import TaskbarItem from "../TaskbarItem/TaskbarItem";
import { useUIStore } from "../../store";
import fileManagerIcon from "../../assets/icons/file-manager.svg";
import DevPanel from "../DevPanel";
import devPanelIcon from "../../assets/icons/nut.svg";
import FileManager from "../../applications/FileManager/FileManager";
import { getOrientation } from "../../helpers";

function Taskbar() {
  const position = useUIStore((s) => s.taskbarPosition);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  const setStartMenuOpen = useUIStore((s) => s.setStartMenuOpen);

  const closeStartMenuIfOpen = () => {
    if (startMenuOpen) setStartMenuOpen(false);
  };

  return (
    <div
      className={`taskbar ${getOrientation(position)} ${position} ${startMenuOpen && "open"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeStartMenuIfOpen();
        }
      }}
    >
      <div className="left-or-top-group">
        <StartButton />
        <TaskbarItem
          icon={fileManagerIcon}
          title={"File Manager"}
          isMinimized={false}
          children={<FileManager />}
        />
        <TaskbarItem
          icon={devPanelIcon}
          title={"Dev Panel"}
          isMinimized={false}
          children={<DevPanel />}
        />
      </div>
      <div className="right-or-bottom-group">
        <TaskbarPositionSetter />
        <FullscreenButton />
        <SmallDateClock />
      </div>
    </div>
  );
}

export default Taskbar;
