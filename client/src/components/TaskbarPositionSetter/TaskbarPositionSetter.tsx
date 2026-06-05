import "./taskbarpositionsetter.scss";
import { useUIStore } from "../../store/useUIStore";
import leftChevronIcon from "../../assets/icons/chevron-left.svg";
import rightChevronIcon from "../../assets/icons/chevron-right.svg";
import upChevronIcon from "../../assets/icons/chevron-up.svg";
import downChevronIcon from "../../assets/icons/chevron-down.svg";

export default function TaskbarPositionSetter() {
  const setTaskbarPosition = useUIStore((state) => state.setTaskbarPosition);

  return (
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
        <image href={leftChevronIcon} x="-14" y="18" />
        <image href={upChevronIcon} x="18" y="-15" />
        <image href={downChevronIcon} x="18" y="50" />
        <image href={rightChevronIcon} x="50" y="18" />
      </svg>
    </div>
  );
}
