import "./desktopfilescontainer.scss";
import { ls } from "../../vfs-actions/ls";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";
import { useDesktopStore } from "../../store/useDesktopStore";
import { useEffect } from "react";
import FileEntryIcon from "../FileEntryIcon/FileEntryIcon";
import type { FileEntry } from "../../interfaces/FileEntry";
import { VFS_ROOT } from "../../constants/constants";

export default function DesktopFilesContainer() {
  const backendAvailable = useSystemStore((state) => state.backendAvailable);
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);
  const desktopEntries = useDesktopStore((state) => state.desktopEntries);
  const setDesktopEntries = useDesktopStore((state) => state.setDesktopEntries);
  const selectedEntry = useDesktopStore((state) => state.selectedEntry);
  const setSelectedEntry = useDesktopStore((state) => state.setSelectedEntry);

  const DESKTOP_PATH = "Desktop/";
  const path: string = `${VFS_ROOT}${DESKTOP_PATH}`;

  useEffect(() => {
    (async () => {
      if (backendAvailable !== null) {
        await ensureOpfsExists();
        const result = await ls(path);
        console.log("ls output:", result.entries);
        setDesktopEntries(result.entries);
      }
    })();
  }, [backendAvailable]);

  return (
    <div
      className={`desktop-files-container ${taskbarPosition}`}
      onClick={() => setSelectedEntry(null)}
    >
      {desktopEntries.length > 0 &&
        desktopEntries.map((entry: FileEntry, index) => (
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
