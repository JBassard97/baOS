import "./backendstatusdisplay.scss";

interface BackendStatusDisplayProps {
  backendAvailable?: null | false | true;
  taskbarPosition: "top" | "bottom" | "left" | "right";
}

function BackendStatusDisplay({
  backendAvailable = null,
  taskbarPosition = "bottom",
}: BackendStatusDisplayProps) {
  return (
    <div className={`backend-status-display ${taskbarPosition}`}>
      {backendAvailable === null && <p>Searching for a Server...</p>}
      {backendAvailable === true && <p>Full-Stack Mode: Using VFS</p>}
      {backendAvailable === false && <p>Client-Only Mode: Using OPFS</p>}
    </div>
  );
}

export default BackendStatusDisplay;
