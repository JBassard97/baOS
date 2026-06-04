import "./desktop.scss";
import Taskbar from "../../components/Taskbar/Taskbar";
import BackendStatusDisplay from "../../components/BackendStatusDisplay/BackendStatusDisplay";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import { isHorizontal } from "../../helpers/isHorizontal";
import { loadConfig } from "../../config/loadConfig";
import { ls } from "../../vfs-actions/ls";
import { touch } from "../../vfs-actions/touch";
import { resetOpfs } from "../../vfs-actions/resetOpfs";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import { useEffect, useState } from "react";
import type { TaskbarPosition } from "../../types/TaskbarPosition";

const config = {
  taskbarPosition: "right" as TaskbarPosition,
};

function Desktop() {
  useBackendStatus(); // Triggers backend check and stores state in useSystemStore
  loadConfig(config); // Takes config and stores state inuseUIStore

  const backendAvailable = useSystemStore((state) => state.backendAvailable);
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);

  const [DesktopEntries, setDesktopEntries] = useState([]);

  useEffect(() => {
    (async () => {
      await ensureOpfsExists();
      const result = await ls("/Desktop");
      console.log("ls output:", result.entries);
      setDesktopEntries(result.entries);
    })();
  }, [backendAvailable]);

  return (
    <div>
      <main
        className={`desktop-main ${
          isHorizontal(taskbarPosition) ? "horizontal" : "vertical"
        } ${taskbarPosition}`}
      >
        <BackendStatusDisplay />

        <div
          className="desktop-files-container"
          style={{ border: "1px solid lime", width: "100%", height: "100%" }}
        >
          {DesktopEntries.length > 0 &&
            DesktopEntries.map((entry: { name: string }, index) => (
              <p key={index}>{entry.name}</p>
            ))}
        </div>
      </main>

      <Taskbar />
    </div>
  );
}

export default Desktop;
