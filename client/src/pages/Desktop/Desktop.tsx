import "./desktop.scss";
import DesktopMain from "../../components/DesktopMain/DesktopMain";
import Taskbar from "../../components/Taskbar/Taskbar";
import BackgroundLayer from "../../components/BackgroundLayer/BackgroundLayer";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { loadConfig } from "../../config/loadConfig";
import type { TaskbarPosition } from "../../types/TaskbarPosition";
import serene from "../../assets/backgrounds/serene.png";

const config = {
  taskbarPosition: "bottom" as TaskbarPosition,
  currentBackground: serene,
};

function Desktop() {
  useBackendStatus(); // Triggers backend check and stores state in useSystemStore
  loadConfig(config); // Takes config and stores state in useUIStore

  return (
    <div>
      <BackgroundLayer />
      <DesktopMain />
      <Taskbar />
    </div>
  );
}

export default Desktop;
