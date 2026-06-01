import "./smalldateclock.scss";
import useTime from "../../hooks/useTime";
import TooltipProvider from "../../providers/TooltipProvider/TooltipProvider";

interface SmallDateClockProps {
  orientation?: "horizontal" | "vertical";
  taskbarPosition?: "top" | "bottom" | "left" | "right";
}

function SmallDateClock({
  orientation = "horizontal",
  taskbarPosition = "bottom",
}: SmallDateClockProps) {
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
