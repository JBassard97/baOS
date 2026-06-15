import "./desktopfilescontainer.scss";
import { ls } from "../../vfs-actions/ls";
import { touch } from "../../vfs-actions/touch";
import { mkdir } from "../../vfs-actions/mkdir";
import { rm } from "../../vfs-actions/rm";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import { useSystemStore } from "../../store/useSystemStore";
import { useUIStore } from "../../store/useUIStore";
import { useDesktopStore } from "../../store/useDesktopStore";
import { useEffect, useState } from "react";
import { useSetBackground } from "../../hooks/useSetBackground";
import { getValidFileName } from "../../helpers/getValidFileName";
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

  const { isCreatingDesktopEntry, creatingType } = useDesktopStore(
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

  function startMakingDesktopEntry(creatingType: "file" | "dir") {
    setSelectedEntry(null);
    setContextMenuEntry(null);
    setDesktopContextMenu({ visible: false, x: 0, y: 0, entry: null });
    setCreatingDesktopEntry({
      isCreatingDesktopEntry: true,
      creatingType: creatingType,
    });
  }

  const loadDesktopEntries = async () => {
    if (backendAvailable === null) return;
    await ensureOpfsExists();
    const result = await ls(path);
    console.log("ls output:", result.entries);
    setDesktopEntries(result.entries);
  };

  const handleDelete = async (entryPath: string) => {
    try {
      await rm(`${path}${entryPath}`);
      loadDesktopEntries();
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log({ tempEntryName, creatingType });

    if (tempEntryName.trim() === "" || isCreatingDesktopEntry === false) {
      console.log("Invalid touch or mkdir name");
      return;
    }

    try {
      if (creatingType === "dir") {
        const result = await mkdir(`${path}${tempEntryName}`);
        console.log("result of mkdir:", result);
      } else if (creatingType === "file") {
        const validFileName = getValidFileName(tempEntryName);
        const result = await touch(`${path}${validFileName}`);
        console.log("result of touch:", result);
      }

      // Reset states and reload
      setCreatingDesktopEntry({
        isCreatingDesktopEntry: false,
        creatingType: null,
      });
      setTempEntryName("");
      loadDesktopEntries();
    } catch (error) {
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    loadDesktopEntries();
  }, [backendAvailable]);

  const sortedEntries = [...desktopEntries].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

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
        setCreatingDesktopEntry({
          isCreatingDesktopEntry: false,
          creatingType: null,
        });
        setTempEntryName("");
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedEntry(null);
        setContextMenuEntry(null);
        setCreatingDesktopEntry({
          isCreatingDesktopEntry: false,
          creatingType: null,
        });
        setDesktopContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          entry: null,
        });
        setCreatingDesktopEntry({
          isCreatingDesktopEntry: false,
          creatingType: null,
        });
        setTempEntryName("");
      }}
    >
      {sortedEntries.length > 0 &&
        sortedEntries.map((entry: FileEntry, index) => (
          <FileEntryIcon
            key={index}
            entry={entry}
            isSelected={selectedEntry === entry.name}
            showActions={contextMenuEntry === entry.name}
            parentPath={path}
            onDelete={async () => handleDelete(entry.name)}
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
                creatingType: null,
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
                creatingType: null,
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
          <img src={creatingType === "dir" ? folderIcon : fileIcon} />
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
          <div
            className="context-item"
            onClick={() => {
              startMakingDesktopEntry("file");
            }}
          >
            New File
          </div>
          <div
            className="context-item"
            onClick={() => {
              startMakingDesktopEntry("dir");
            }}
          >
            New Folder
          </div>
          <div className="context-item" onClick={pickBackground}>
            Set Background
          </div>
        </div>
      )}
    </div>
  );
}
