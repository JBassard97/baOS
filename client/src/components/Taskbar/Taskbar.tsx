import "./taskbar.scss";

interface TaskbarProps {
  position?: "top" | "bottom" | "left" | "right";
}

function Taskbar({ position = "bottom" }: TaskbarProps) {
  return (
    <div
      className={`taskbar ${position === "top" || position === "bottom" ? "horizontal" : "vertical"} ${position}`}
    ></div>
  );
}

export default Taskbar;
