import "./filemanager.scss";
import { useState, useEffect } from "react";
import { VFS_ROOT } from "../../constants/constants";
import { ls } from "../../vfs-actions/ls";
import { touch } from "../../vfs-actions/touch";
import { rm } from "../../vfs-actions/rm";
import { mkdir } from "../../vfs-actions/mkdir";
import { getFileIcon } from "../../helpers/getFileIcon";
import { getValidFileName } from "../../helpers/getValidFileName";
import { formatBytes } from "../../helpers/formatBytes";
import homeIcon from "../../assets/icons/home.svg";
import backIcon from "../../assets/icons/go-back.svg";
import { useFileSystemChanged } from "../../hooks/useFileSystemChanged";
import { PlusIcon, FileIcon, FolderIcon } from "../../icon-components";

export default function FileManager({
  startPath,
}: {
  startPath?: string | undefined;
}) {
  const [pathInputState, setPathInputState] = useState<string>(
    startPath ? startPath : VFS_ROOT,
  );
  const [entriesFound, setEntriesFound] = useState([]);
  const [pathFound, setPathFound] = useState<string>(
    startPath ? startPath : VFS_ROOT,
  );

  const [creatingEntryType, setCreatingEntryType] = useState<
    "file" | "dir" | null
  >(null);

  const [creatingEntryName, setCreatingEntryName] = useState<string>("");

  const [contextMenuOpen, setContextMenuOpen] = useState<number | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (creatingEntryName.trim() === "") {
      return;
    }
    if (creatingEntryType === null) return;
    try {
      if (creatingEntryType === "dir") {
        const result = await mkdir(`${pathFound}${creatingEntryName}`);
        console.log(result);
      } else if (creatingEntryType === "file") {
        const result = await touch(
          `${pathFound}${getValidFileName(creatingEntryName)}`,
        );
        console.log(result);
      }
      setCreatingEntryType(null);
      setCreatingEntryName("");
      setPathInputState(pathFound);
      fetchPath(pathFound);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const handleDelete = async (entryPath: string) => {
    try {
      await rm(`${pathFound}${entryPath}`);
      setPathInputState(pathFound);
      fetchPath(pathFound);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const fetchPath = async (path: string): Promise<void> => {
    try {
      const result = await ls(path);
      if (result.entries) {
        setEntriesFound(result.entries);
        setPathFound(
          result.path.endsWith("/") ? result.path : `${result.path}/`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const stopCreatingEntry = () => {
    setCreatingEntryType(null);
    setCreatingEntryName("");
  };

  useEffect(() => {
    fetchPath(pathInputState);
  }, [pathInputState]);

  useFileSystemChanged(() => fetchPath(pathFound));

  return (
    <div className="file-manager">
      <div className="form-container">
        <div className="options-bar">
          <p
            className="option"
            onClick={() => {
              if (creatingEntryType !== "file") {
                setCreatingEntryType("file");
              } else {
                stopCreatingEntry();
              }
            }}
          >
            <PlusIcon />
            <FileIcon />
          </p>
          <p
            className="option"
            onClick={() => {
              if (creatingEntryType !== "dir") {
                setCreatingEntryType("dir");
              } else {
                stopCreatingEntry();
              }
            }}
          >
            <PlusIcon />
            <FolderIcon />
          </p>
          <p className="option">Upload...</p>
        </div>

        <input
          type="text"
          id="path-input"
          value={pathInputState}
          onChange={(e) => setPathInputState(e.target.value)}
          onClick={stopCreatingEntry}
        />
        <div className="status-bar">
          <p className="entries-found">Entries Found: {entriesFound.length}</p>
          <div>
            <div
              className="go-back"
              onClick={() => {
                const trimmed = pathFound.endsWith("/")
                  ? pathFound.slice(0, -1)
                  : pathFound;

                const lastSlash = trimmed.lastIndexOf("/");

                setPathInputState(
                  lastSlash <= 0 ? "/" : `${trimmed.slice(0, lastSlash)}/`,
                );
                stopCreatingEntry();
              }}
            >
              <img src={backIcon} />
            </div>
            <div
              className="go-home"
              onClick={() => {
                setPathInputState("/");
                stopCreatingEntry();
              }}
            >
              <img src={homeIcon} />
            </div>
          </div>
        </div>
      </div>
      <div className="entries-container" onClick={stopCreatingEntry}>
        {entriesFound.length > 0 &&
          entriesFound.map(
            (
              entry: {
                name: string;
                type: string;
                size: number;
                previewUrl: string;
                previewType: string;
              },
              index,
            ) => (
              <>
                <div
                  key={index}
                  className="file-manager-entry"
                  onClick={() => {
                    stopCreatingEntry();
                    setContextMenuOpen(null);
                    if (entry.type === "dir") {
                      setPathInputState(`${pathFound}${entry.name}/`);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    stopCreatingEntry();
                    setContextMenuOpen(index);
                  }}
                >
                  {entry.previewType === "video" ? (
                    <video
                      src={entry.previewUrl}
                      loop
                      muted
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <img
                      src={
                        entry.previewUrl ??
                        getFileIcon(entry.name, entry.type === "dir")
                      }
                    />
                  )}
                  <div className="entry-text">
                    <p className="entry-name">
                      {entry.name}
                      {entry.type === "dir" && "/"}
                    </p>
                  </div>
                  <div className="entry-details-bar">
                    <p>"{entry.type}"</p>
                    {entry.size >= 0 && <p>{formatBytes(entry.size)}</p>}
                  </div>

                  {contextMenuOpen === index && (
                    <div className="file-manager-context-menu">
                      <div
                        className="option"
                        onClick={() => {
                          handleDelete(entry.name);
                          setContextMenuOpen(null);
                        }}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </>
            ),
          )}

        {creatingEntryType !== null && (
          <div className="file-manager-entry">
            <img
              src={getFileIcon(creatingEntryName, creatingEntryType === "dir")}
            />
            <div className="entry-text">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={creatingEntryName}
                  onChange={(e) => setCreatingEntryName(e.target.value)}
                  autoFocus
                  enterKeyHint="done"
                />
              </form>
            </div>
            <div className="entry-details-bar">
              <p>Type:"{creatingEntryType}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
