import "./desktopfilescontainer.scss";
import { ls } from "../../vfs-actions/ls";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";
import { useState, useEffect } from "react";

export default function DesktopFilesContainer() {
  const backendAvailable = useSystemStore((state) => state.backendAvailable);
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);
  const [DesktopEntries, setDesktopEntries] = useState([]);

  useEffect(() => {
    (async () => {
      await ensureOpfsExists();
      const result = await ls("Desktop");
      console.log("ls output:", result.entries);
      setDesktopEntries(result.entries);
    })();
  }, [backendAvailable]);

  return (
    <div className={`desktop-files-container ${taskbarPosition}`}>
      {DesktopEntries.length > 0 &&
        DesktopEntries.map((entry: { name: string }, index) => (
          <div key={index} className="file-entry">
            <p>{entry.name}</p>
          </div>
        ))}
    </div>
  );
}
