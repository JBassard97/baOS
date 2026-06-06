import "./desktopfilescontainer.scss";
import { ls } from "../../vfs-actions/ls";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";
import { useState, useEffect } from "react";
import FileEntryIcon from "../FileEntryIcon/FileEntryIcon";

interface FileEntry {
  name: string;
  type: string;
}

export default function DesktopFilesContainer() {
  const backendAvailable = useSystemStore((state) => state.backendAvailable);
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);
  const [DesktopEntries, setDesktopEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  // Default value = "/Desktop"
  const path: string = "";

  useEffect(() => {
    (async () => {
      await ensureOpfsExists();
      const result = await ls(path);
      console.log("ls output:", result.entries);
      setDesktopEntries(result.entries);
    })();
  }, [backendAvailable]);

  useEffect(() => {
    console.log(selectedEntry);
  }, [selectedEntry]);

  return (
    <div
      className={`desktop-files-container ${taskbarPosition}`}
      onClick={() => setSelectedEntry(null)}
    >
      {DesktopEntries.length > 0 &&
        DesktopEntries.map((entry: FileEntry, index) => (
          <FileEntryIcon
            entry={entry}
            key={index}
            isSelected={selectedEntry === entry.name}
            onSelect={() =>
              setSelectedEntry(entry.name === selectedEntry ? null : entry.name)
            }
            parentPath={path}
          />
        ))}
    </div>
  );
}
