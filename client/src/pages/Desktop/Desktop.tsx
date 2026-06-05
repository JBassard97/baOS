import "./desktop.scss";
import DesktopMain from "../../components/DesktopMain/DesktopMain";
import Taskbar from "../../components/Taskbar/Taskbar";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { loadConfig } from "../../config/loadConfig";
import type { TaskbarPosition } from "../../types/TaskbarPosition";

const config = {
  taskbarPosition: "bottom" as TaskbarPosition,
};

function Desktop() {
  useBackendStatus(); // Triggers backend check and stores state in useSystemStore
  loadConfig(config); // Takes config and stores state inuseUIStore

  return (
    <div>
      <DesktopMain />
      <Taskbar />
    </div>
  );
}

export default Desktop;
