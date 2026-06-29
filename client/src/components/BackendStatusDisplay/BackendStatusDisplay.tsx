import "./backendstatusdisplay.scss";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";

function BackendStatusDisplay() {
  const backendAvailable = useSystemStore((state) => state.backendAvailable);
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);
  if (!backendAvailable || backendAvailable === null) return;
  return (
    <div className={`backend-status-display ${taskbarPosition}`}>
      {/* {backendAvailable === null && <p>Searching for a Server...</p>} */}
      {backendAvailable === true && <p>Local Server Connected</p>}
      {/* {backendAvailable === false && <p>Client Mode: Using OPFS</p>} */}
    </div>
  );
}

export default BackendStatusDisplay;
