import "./desktopfilescontainer.scss";
import { ls } from "../../vfs-actions/ls";
// import { touch } from "../../vfs-actions/touch";
// import { mkdir } from "../../vfs-actions/mkdir";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";
import { useDesktopStore } from "../../store/useDesktopStore";
import { useEffect, useState } from "react";
import { useSetBackground } from "../../hooks/useSetBackground";
import FileEntryIcon from "../FileEntryIcon/FileEntryIcon";
import type { FileEntry } from "../../interfaces/FileEntry";
import { VFS_ROOT } from "../../constants/constants";
import fileIcon from "../../assets/icons/file-icon.svg";
import folderIcon from "../../assets/icons/folder-icon.svg";

export default function DesktopFilesContainer() {
  const DESKTOP_PATH = "Desktop/";
  const path: string = `${VFS_ROOT}${DESKTOP_PATH}`;

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

  const { isCreatingDesktopEntry, type } = useDesktopStore(
    (state) => state.creatingDesktopEntry,
  );
  const setCreatingDesktopEntry = useDesktopStore(
    (state) => state.setCreatingDesktopEntry,
  );

  const desktopContextMenu = useDesktopStore(
    (state) => state.desktopContextMenu,
  );
  const setDesktopContextMenu = useDesktopStore(
    (state) => state.setDesktopContextMenu,
  );

  const [tempEntryName, setTempEntryName] = useState<string>("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Submitted:", tempEntryName);
    // try {
    // } catch {}
  };



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
        setDesktopContextMenu({
          visible: false,
          x: 0,
          y: 0,
          entry: null,
        });
        setCreatingDesktopEntry({ isCreatingDesktopEntry: false, type: null });
        setTempEntryName("");
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedEntry(null);
        setContextMenuEntry(null);
        setCreatingDesktopEntry({
          isCreatingDesktopEntry: false,
          type: null,
        });
        setDesktopContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          entry: null,
        });
        setCreatingDesktopEntry({
          isCreatingDesktopEntry: false,
          type: null,
        });
        setTempEntryName("");
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
            onSelect={() => {
              setSelectedEntry(
                entry.name === selectedEntry ? null : entry.name,
              );
              setDesktopContextMenu({
                visible: false,
                x: 0,
                y: 0,
                entry: null,
              });
              setCreatingDesktopEntry({
                isCreatingDesktopEntry: false,
                type: null,
              });
              setTempEntryName("");
            }}
            onContextMenuOpen={() => {
              setSelectedEntry(entry.name);
              setContextMenuEntry(entry.name);
              setDesktopContextMenu({
                visible: false,
                x: 0,
                y: 0,
                entry: null,
              });
              setCreatingDesktopEntry({
                isCreatingDesktopEntry: false,
                type: null,
              });
              setTempEntryName("");
            }}
          />
        ))}

      {isCreatingDesktopEntry && (
        <div
          style={{
            height: "125px",
            minWidth: 0,
            fontFamily: "Segoe UI, sans-serif",
            fontSize: "0.8rem",
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <img src={type === "dir" ? folderIcon : fileIcon} />
          <form onSubmit={handleSubmit}>
            <input
              style={{
                width: "100%",
                padding: "0.1rem 0",
                textAlign: "center",
              }}
              type="text"
              value={tempEntryName}
              onChange={(e) => setTempEntryName(e.target.value)}
              autoFocus
enterKeyHint="done"
            />
          </form>
        </div>
      )}

      {desktopContextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: desktopContextMenu.y,
            left: desktopContextMenu.x,
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
