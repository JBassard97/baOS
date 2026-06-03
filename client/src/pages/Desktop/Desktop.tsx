import "./desktop.scss";
import Taskbar from "../../components/Taskbar/Taskbar";
import BackendStatusDisplay from "../../components/BackendStatusDisplay/BackendStatusDisplay";
import { useSystemStore } from "../../store/useSystemStore";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { ls } from "../../vfs-actions/ls";
import { touch } from "../../vfs-actions/touch";

type TaskbarPosition = "top" | "bottom" | "left" | "right";

const config = {
  taskbarPosition: "bottom" as TaskbarPosition,
};

function Desktop() {
  // IMPORTANT: this triggers the backend check
  useBackendStatus();

  const { taskbarPosition } = config;

  const isHorizontal =
    taskbarPosition === "bottom" || taskbarPosition === "top";

  const backendAvailable = useSystemStore((state) => state.backendAvailable);

  return (
    <div>
      <main
        className={`desktop-main ${
          isHorizontal ? "horizontal" : "vertical"
        } ${taskbarPosition}`}
      >
        <BackendStatusDisplay
          backendAvailable={backendAvailable}
          taskbarPosition={taskbarPosition}
        />

        <button onClick={async () => ls("/")}>ls</button>
        <button onClick={async () => touch("yahoo.txt")}>touch test.txt</button>
      </main>

      <Taskbar position={taskbarPosition} />
    </div>
  );
}

export default Desktop;
