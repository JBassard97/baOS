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

  return (
    <div
      className={`taskbar ${getOrientation(position)} ${position} ${startMenuOpen && "open"}`}
    >
      <div className="left-or-top-group">
        <StartButton
          orientation={getOrientation(position)}
          taskbarPosition={position}
        />
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
        <FullscreenButton
          orientation={getOrientation(position)}
          taskbarPosition={position}
        />
        <SmallDateClock />
      </div>
    </div>
  );
}

export default Taskbar;
