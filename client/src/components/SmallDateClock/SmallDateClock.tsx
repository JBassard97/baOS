import "./smalldateclock.scss";

interface SmallDateClockProps {
  orientation?: "horizontal" | "vertical";
}

function SmallDateClock({ orientation = "horizontal" }: SmallDateClockProps) {
  return (
    <div className={`small-date-clock ${orientation}`}>
      <span className="time">11:35 AM</span>
      <span className="date">6/1/26</span>
    </div>
  );
}

export default SmallDateClock;
