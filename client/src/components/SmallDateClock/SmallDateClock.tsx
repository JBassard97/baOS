import "./smalldateclock.scss";
import { useTime } from "../../hooks/useTime";
import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";
import { useUIStore } from "../../store";
import { getOrientation } from "../../helpers";

function SmallDateClock() {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const orientation = getOrientation(taskbarPosition);

  const now = useTime();

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString([], {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  });

  return (
    <TooltipProvider text="Date & Time" taskbarPosition={taskbarPosition}>
      <div className={`small-date-clock ${orientation}`}>
        <span className="time">{time}</span>
        <span className="date">{date}</span>
      </div>
    </TooltipProvider>
  );
}

export default SmallDateClock;
