import "./taskbar.scss";
import StartButton from "../StartButton/StartButton";
import SmallDateClock from "../SmallDateClock/SmallDateClock";
import FullscreenButton from "../FullscreenButton/FullscreenButton";

interface TaskbarProps {
  position?: "top" | "bottom" | "left" | "right";
}

const getOrientation = (position: TaskbarProps["position"]) => {
  return position === "top" || position === "bottom"
    ? "horizontal"
    : "vertical";
};

function Taskbar({ position = "bottom" }: TaskbarProps) {
  return (
    <div className={`taskbar ${getOrientation(position)} ${position}`}>
      <div className="left-or-top-group">
        <StartButton
          orientation={getOrientation(position)}
          taskbarPosition={position}
        />
      </div>
      <div className="right-or-bottom-group">
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
