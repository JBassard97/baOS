import "./backendstatusdisplay.scss";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";

function BackendStatusDisplay() {
  const backendAvailable = useSystemStore((state) => state.backendAvailable);
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);
  return (
    <div className={`backend-status-display ${taskbarPosition}`}>
      {backendAvailable === null && <p>Searching for a Server...</p>}
      {backendAvailable === true && <p>Server Mode: Using VFS</p>}
      {backendAvailable === false && <p>Client Mode: Using OPFS</p>}
    </div>
  );
}

export default BackendStatusDisplay;
