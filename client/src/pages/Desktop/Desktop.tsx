import "./desktop.scss";
import DesktopMain from "../../components/DesktopMain/DesktopMain";
import Taskbar from "../../components/Taskbar/Taskbar";
import BackgroundLayer from "../../components/BackgroundLayer/BackgroundLayer";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { loadConfig } from "../../config/loadConfig";
import type { TaskbarPosition } from "../../types/TaskbarPosition";
// import DevPanel from "../../components/DevPanel";

const config = {
  taskbarPosition: "bottom" as TaskbarPosition,
};

function Desktop() {
  useBackendStatus(); // Triggers backend check and stores state in useSystemStore
  loadConfig(config); // Takes config and stores state in useUIStore

  return (
    <div>
      <BackgroundLayer />
      <DesktopMain />
      <Taskbar />
      {/* <DevPanel /> */}
    </div>
  );
}

export default Desktop;
