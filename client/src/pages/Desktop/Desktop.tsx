import "./desktop.scss";
import Taskbar from "../../components/Taskbar/Taskbar";

type TaskbarPosition = "top" | "bottom" | "left" | "right";

// config — change this to move the taskbar
const config: { taskbarPosition: TaskbarPosition } = {
  taskbarPosition: "bottom",
};

function Desktop() {
  const { taskbarPosition } = config;
  const isHorizontal =
    taskbarPosition === "bottom" || taskbarPosition === "top";

  return (
    <div>
      <main
        className={`desktop-main ${isHorizontal ? "horizontal" : "vertical"} ${taskbarPosition}`}
      ></main>
      <Taskbar position={taskbarPosition} />
    </div>
  );
}

export default Desktop;
