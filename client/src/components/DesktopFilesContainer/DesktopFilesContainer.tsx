import "./desktopfilescontainer.scss";
import { ls } from "../../vfs-actions/ls";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";
import { useDesktopStore } from "../../store/useDesktopStore";
import { useEffect, useState } from "react";
import { useSetBackground } from "../../hooks/useSetBackground";
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

  const contextMenuEntry = useDesktopStore((state) => state.contextMenuEntry);
  const setContextMenuEntry = useDesktopStore(
    (state) => state.setContextMenuEntry,
  );

  const { pickBackground } = useSetBackground();

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    entry: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    entry: null,
  });

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
      onClick={() => {
        setSelectedEntry(null);
        setContextMenuEntry(null);
        setContextMenu({
          visible: false,
          x: 0,
          y: 0,
          entry: null,
        });
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedEntry(null);
        setContextMenuEntry(null);
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          entry: null,
        });
      }}
    >
      {desktopEntries.length > 0 &&
        desktopEntries.map((entry: FileEntry, index) => (
          <FileEntryIcon
            key={index}
            entry={entry}
            isSelected={selectedEntry === entry.name}
            showActions={contextMenuEntry === entry.name}
            parentPath={path}
            onSelect={() =>
              setSelectedEntry(entry.name === selectedEntry ? null : entry.name)
            }
            onContextMenuOpen={() => {
              setSelectedEntry(entry.name);
              setContextMenuEntry(entry.name);
            }}
          />
        ))}

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-item">New File</div>
          <div className="context-item">New Folder</div>
          <div className="context-item" onClick={pickBackground}>
            Set Background
          </div>
        </div>
      )}
    </div>
  );
}
