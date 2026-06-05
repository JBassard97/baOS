import "./taskbarpositionsetter.scss";
import { useUIStore } from "../../store/useUIStore";
import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";
import leftChevronIcon from "../../assets/icons/chevron-left.svg";
import rightChevronIcon from "../../assets/icons/chevron-right.svg";
import upChevronIcon from "../../assets/icons/chevron-up.svg";
import downChevronIcon from "../../assets/icons/chevron-down.svg";

export default function TaskbarPositionSetter() {
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);
  const setTaskbarPosition = useUIStore((state) => state.setTaskbarPosition);

  return (
    <TooltipProvider text="Move Taskbar" taskbarPosition={taskbarPosition}>
      <div className="taskbar-position-setter">
        <svg viewBox="0 0 100 100" width="100">
          <polygon
            points="0,0 100,0 50,50"
            className="up"
            onClick={() => setTaskbarPosition("top")}
          />
          <polygon
            points="100,0 100,100 50,50"
            className="right"
            onClick={() => setTaskbarPosition("right")}
          />
          <polygon
            points="0,100 100,100 50,50"
            className="down"
            onClick={() => setTaskbarPosition("bottom")}
          />
          <polygon
            points="0,0 0,100 50,50"
            className="left"
            onClick={() => setTaskbarPosition("left")}
          />
          <image href={leftChevronIcon} width="32" height="32" x="1" y="34" />
          <image href={upChevronIcon} width="32" height="32" x="34" y="1" />
          <image href={downChevronIcon} width="32" height="32" x="34" y="67" />
          <image href={rightChevronIcon} width="32" height="32" x="67" y="34" />
        </svg>
      </div>
    </TooltipProvider>
  );
}
