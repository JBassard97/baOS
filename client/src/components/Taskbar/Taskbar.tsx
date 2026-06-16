import "./taskbar.scss";
import StartButton from "../StartButton/StartButton";
import SmallDateClock from "../SmallDateClock/SmallDateClock";
import FullscreenButton from "../FullscreenButton/FullscreenButton";
import TaskbarPositionSetter from "../TaskbarPositionSetter/TaskbarPositionSetter";
import TaskbarItem from "../TaskbarItem/TaskbarItem";
import { useUIStore } from "../../store/useUIStore";
import fileManagerIcon from "../../assets/icons/file-manager.svg";

interface TaskbarProps {
  position?: "top" | "bottom" | "left" | "right";
}

const getOrientation = (position: TaskbarProps["position"]) => {
  return position === "top" || position === "bottom"
    ? "horizontal"
    : "vertical";
};

function Taskbar() {
  const position = useUIStore((state) => state.taskbarPosition);

  return (
    <div className={`taskbar ${getOrientation(position)} ${position}`}>
      <div className="left-or-top-group">
        <StartButton
          orientation={getOrientation(position)}
          taskbarPosition={position}
        />
        <TaskbarItem
          icon={fileManagerIcon}
          title={"File Manager"}
          isMinimized={false}
          children={<h3>File Manager</h3>}
        />
      </div>
      <div className="right-or-bottom-group">
        <TaskbarPositionSetter />
        <FullscreenButton
          orientation={getOrientation(position)}
          taskbarPosition={position}
        />
        <SmallDateClock
          orientation={getOrientation(position)}
          taskbarPosition={position}
        />
      </div>
    </div>
  );
}

export default Taskbar;
