import "./desktopfilescontainer.scss";
import { ls } from "../../vfs-actions/ls";
import { touch } from "../../vfs-actions/touch";
import { mkdir } from "../../vfs-actions/mkdir";
import { rm } from "../../vfs-actions/rm";
import { mv } from "../../vfs-actions/mv";
import { ensureOpfsExists } from "../../vfs-actions/ensureOpfsExists";
import {
  useUIStore,
  useSystemStore,
  useDesktopStore,
  useWindowStore,
} from "../../store";
import { useEffect, useState } from "react";
import { useFileSystemChanged, useSetBackground } from "../../hooks";
import FileEntryIcon from "../FileEntryIcon/FileEntryIcon";
import type { FileEntry } from "../../interfaces/FileEntry";
import { VFS_ROOT } from "../../constants/constants";
import { getFileIcon, getValidFileName } from "../../helpers";
import {
  uploadFilesToVFS,
  uploadFolderToVFS,
  uploadFromDrop,
} from "../../vfs-actions/uploadToVfs";

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

  const unfocusAllWindows = useWindowStore((s) => s.unfocusAllWindows);

  const [tempEntryName, setTempEntryName] = useState<string>("");

  const hideDesktopContextMenu = () => {
    setDesktopContextMenu({
      visible: false,
      x: 0,
      y: 0,
      entry: null,
    });
  };

  function startUploadingDesktopEntry(uploadingType: "file" | "dir") {
    setSelectedEntry(null);
    setContextMenuEntry(null);
    setDesktopContextMenu({ visible: false, x: 0, y: 0, entry: null });
    setCreatingDesktopEntry({
      isCreatingDesktopEntry: false,
      creatingType: null,
    });
    if (uploadingType === "file") {
      uploadFilesToVFS("/Desktop/");
    } else if (uploadingType === "dir") {
      uploadFolderToVFS("/Desktop/");
    }
  }

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

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key !== "Delete") return;

      if (!selectedEntry) return;

      e.preventDefault();

      await handleDelete(selectedEntry);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEntry]);

  const sortedEntries = [...desktopEntries].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  useFileSystemChanged(loadDesktopEntries);

  return (
    <div
      className={`desktop-files-container ${taskbarPosition}`}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={async (e) => {
        e.preventDefault();

        try {
          setSelectedEntry(null);
          setContextMenuEntry(null);
          setDesktopContextMenu({ visible: false, x: 0, y: 0, entry: null });
          setCreatingDesktopEntry({
            isCreatingDesktopEntry: false,
            creatingType: null,
          });
          const baosData = e.dataTransfer.getData("application/x-baos-entry");
          if (baosData) {
            const entry = JSON.parse(baosData);
            console.log("x-baos-entry dropped:", entry);
            const entryPath: string = entry.path;
            const entryName = entry.name;
            if (entryPath.startsWith(`/Desktop/${entryName}`)) return;

            await mv(entryPath, `/Desktop/${entryName}`);
          } else {
            await uploadFromDrop(e.dataTransfer, "/Desktop/");
          }
        } catch (err) {
          console.error(err);
        }
      }}
      onClick={() => {
        setSelectedEntry(null);
        setContextMenuEntry(null);
        hideDesktopContextMenu();
        setCreatingDesktopEntry({
          isCreatingDesktopEntry: false,
          creatingType: null,
        });
        setTempEntryName("");
        unfocusAllWindows();
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
        unfocusAllWindows();
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
              hideDesktopContextMenu();
              setCreatingDesktopEntry({
                isCreatingDesktopEntry: false,
                creatingType: null,
              });
              setTempEntryName("");
            }}
            onContextMenuOpen={() => {
              setSelectedEntry(entry.name);
              setContextMenuEntry(entry.name);
              hideDesktopContextMenu();
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
          <img src={getFileIcon(tempEntryName, creatingType === "dir")} />
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
              startUploadingDesktopEntry("file");
            }}
          >
            Upload File
          </div>
          <div
            className="context-item"
            onClick={() => {
              startMakingDesktopEntry("dir");
            }}
          >
            New Folder
          </div>
          <div
            className="context-item"
            onClick={() => {
              startUploadingDesktopEntry("dir");
            }}
          >
            Upload Folder
          </div>
          <div
            className="context-item"
            onClick={() => {
              pickBackground();
              hideDesktopContextMenu();
            }}
          >
            Set Background
          </div>
        </div>
      )}
    </div>
  );
}
