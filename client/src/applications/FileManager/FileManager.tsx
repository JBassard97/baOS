import "./filemanager.scss";
import { useState, useEffect } from "react";
import { VFS_ROOT } from "../../constants/constants";
import { ls } from "../../vfs-actions/ls";
import { touch } from "../../vfs-actions/touch";
import { rm } from "../../vfs-actions/rm";
import { mkdir } from "../../vfs-actions/mkdir";
import { mv } from "../../vfs-actions/mv";
import {
  uploadFilesToVFS,
  uploadFolderToVFS,
  uploadFromDrop,
} from "../../vfs-actions/uploadToVfs";
import { getValidFileName, getFileIcon, formatBytes } from "../../helpers";
import homeIcon from "../../assets/icons/home.svg";
import backIcon from "../../assets/icons/go-back.svg";
import { useFileSystemChanged } from "../../hooks";
import {
  PlusIcon,
  FileIcon,
  FolderIcon,
  DownloadIcon,
} from "../../icon-components";
import { useUIStore, useWindowStore } from "../../store";
import { isVideoFile, isImageFile } from "../../helpers";
import { openFile } from "../../utils/openFile";
import HtmlViewer from "../HtmlViewer/HtmlViewer";
import htmlViewerIcon from "../../assets/icons/html.svg";
import TextEditor from "../TextEditor/TextEditor";
import textEditorIcon from "../../assets/icons/text-editor.svg";
import MarkdownViewer from "../MarkdownViewer/MarkdownViewer";
import markdownViewerIcon from "../../assets/icons/markdown.svg";

interface ActionProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children?: React.ReactNode;
  danger?: boolean;
}

function Action({ label, onClick, children, danger = false }: ActionProps) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasChildren = !!children;

  return (
    <div
      className="action-wrapper"
      onClick={(e) => {
        if (hasChildren) {
          e.stopPropagation();
          setSubmenuOpen(true);
        }
      }}
      // onMouseLeave={() => setSubmenuOpen(false)}
    >
      <div
        className="action"
        style={danger ? { color: "pink" } : undefined}
        onClick={(e) => {
          if (hasChildren) {
            setSubmenuOpen((prev) => !prev);
          } else {
            onClick?.(e);
          }
        }}
      >
        <span>{label}</span>
        {hasChildren && <span className="submenu-arrow">▶</span>}
      </div>
      {hasChildren && (
        <div
          className="submenu"
          style={{
            visibility: submenuOpen ? "visible" : "hidden",
            opacity: submenuOpen ? 1 : 0,
            pointerEvents: submenuOpen ? "auto" : "none",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function FileManager({
  startPath,
}: {
  startPath?: string | undefined;
}) {
  const [pathInputState, setPathInputState] = useState<string>(
    startPath ? startPath : VFS_ROOT,
  );
  const [entriesFound, setEntriesFound] = useState<any[]>([]);
  const [pathFound, setPathFound] = useState<string>(
    startPath ? startPath : VFS_ROOT,
  );

  const [creatingEntryType, setCreatingEntryType] = useState<
    "file" | "dir" | null
  >(null);

  const [creatingEntryName, setCreatingEntryName] = useState<string>("");
  const [contextMenuOpen, setContextMenuOpen] = useState<number | null>(null);
  const setCurrentBackground = useUIStore((s) => s.setCurrentBackground);
  const addActiveWindow = useWindowStore((s) => s.addActiveWindow);

  const [storageEstimate, setStorageEstimate] = useState<{
    quota: number;
    usage: number;
  }>({ quota: 0, usage: 0 });

  const updateStorateEstimate = async (): Promise<void> => {
    const { quota = 0, usage = 0 } = await navigator.storage.estimate();
    setStorageEstimate({ quota: quota, usage: usage });
  };

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
    updateStorateEstimate();
  }, [pathInputState]);

  useFileSystemChanged(() => {
    fetchPath(pathFound);
    updateStorateEstimate();
  });

  return (
    <div className="file-manager">
      <div className="form-container">
        <div className="options-bar">
          <div>
            <p
              className="option"
              onClick={() => {
                if (creatingEntryType !== "file") {
                  setCreatingEntryType("file");
                } else {
                  stopCreatingEntry();
                }
                setContextMenuOpen(null);
              }}
            >
              <PlusIcon />
              <FileIcon />
            </p>
            <p
              className="option"
              onClick={() => {
                uploadFilesToVFS(pathFound).then(() => fetchPath(pathFound));
                stopCreatingEntry();
                setContextMenuOpen(null);
              }}
            >
              <DownloadIcon />
              <FileIcon />
            </p>
          </div>
          <div>
            <p
              className="option"
              onClick={() => {
                if (creatingEntryType !== "dir") {
                  setCreatingEntryType("dir");
                } else {
                  stopCreatingEntry();
                }
                setContextMenuOpen(null);
              }}
            >
              <PlusIcon />
              <FolderIcon />
            </p>
            <p
              className="option"
              onClick={() => {
                uploadFolderToVFS(pathFound).then(() => fetchPath(pathFound));
                stopCreatingEntry();
                setContextMenuOpen(null);
              }}
            >
              <DownloadIcon />
              <FolderIcon />
            </p>
          </div>
        </div>

        <input
          type="text"
          id="path-input"
          value={pathInputState}
          onChange={(e) => setPathInputState(e.target.value)}
          onClick={() => {
            stopCreatingEntry();
            setContextMenuOpen(null);
          }}
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
                setContextMenuOpen(null);
                stopCreatingEntry();
              }}
            >
              <img src={backIcon} />
            </div>
            <div
              className="go-home"
              onClick={() => {
                setPathInputState("/");
                setContextMenuOpen(null);
                stopCreatingEntry();
              }}
            >
              <img src={homeIcon} />
            </div>
          </div>
        </div>
      </div>
      <div
        className="entries-container"
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={async (e) => {
          e.preventDefault();
          try {
            const baosData = e.dataTransfer.getData("application/x-baos-entry");
            if (baosData) {
              const entry = JSON.parse(baosData);
              console.log("x-baos-entry dropped:", entry);
              const entryPath: string = entry.path;
              const entryName = entry.name;
              if (entryPath.startsWith(`${pathFound}${entryName}`)) return;

              await mv(entryPath, `${pathFound}${entryName}`);
            } else {
              await uploadFromDrop(e.dataTransfer, pathFound);
            }
          } catch (err) {
            console.error(err);
          }
        }}
        onClick={() => {
          stopCreatingEntry();
          setContextMenuOpen(null);
        }}
      >
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
              <div key={index}>
                <div
                  draggable
                  className="file-manager-entry"
                  onClick={() => {
                    stopCreatingEntry();
                    if (entry.type === "dir") {
                      setPathInputState(`${pathFound}${entry.name}/`);
                    }
                    setContextMenuOpen(null);
                  }}
                  onDoubleClick={() => {
                    stopCreatingEntry();
                    setContextMenuOpen(null);
                    if (entry.type === "file") {
                      openFile(`${pathFound}${entry.name}`);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    stopCreatingEntry();
                    setContextMenuOpen(index);
                  }}
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      "application/x-baos-entry",
                      JSON.stringify({
                        path: `${pathFound}${entry.name}`,
                        name: entry.name,
                      }),
                    )
                  }
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
                    <div
                      className="file-manager-context-menu"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* File options */}
                      {entry.type === "file" && (
                        <>
                          <Action
                            label="Open"
                            onClick={() => {
                              setContextMenuOpen(null);
                              openFile(`${pathFound}${entry.name}`);
                            }}
                          />

                          {/* Specialty File Options */}

                          {entry.name.endsWith(".html") && (
                            <Action label="Open With">
                              <Action
                                label="HTML Viewer"
                                onClick={() => {
                                  setContextMenuOpen(null);
                                  addActiveWindow({
                                    id: crypto.randomUUID(),
                                    title: "HTML Viewer",
                                    icon: htmlViewerIcon,
                                    children: (
                                      <HtmlViewer
                                        startFilePath={`${pathFound}${entry.name}`}
                                      />
                                    ),
                                    isMinimized: false,
                                    isFullscreen: false,
                                    isFocused: true,
                                  });
                                }}
                              />
                              <Action
                                label="Text Editor"
                                onClick={() => {
                                  setContextMenuOpen(null);
                                  openFile(`${pathFound}${entry.name}`);
                                }}
                              />
                            </Action>
                          )}

                          {entry.name.endsWith(".md") && (
                            <Action label="Open With">
                              <Action
                                label="Markdown Viewer"
                                onClick={() => {
                                  setContextMenuOpen(null);
                                  addActiveWindow({
                                    id: crypto.randomUUID(),
                                    title: "Markdown Viewer",
                                    icon: markdownViewerIcon,
                                    children: (
                                      <MarkdownViewer
                                        startFilePath={`${pathFound}${entry.name}`}
                                      />
                                    ),
                                    isMinimized: false,
                                    isFullscreen: false,
                                    isFocused: true,
                                  });
                                }}
                              />
                              <Action
                                label="Text Editor"
                                onClick={() => {
                                  setContextMenuOpen(null);
                                  openFile(`${pathFound}${entry.name}`);
                                }}
                              />
                            </Action>
                          )}

                          {entry.name.endsWith(".svg") && (
                            <Action label="Open With">
                              <Action
                                label="Text Editor"
                                onClick={() => {
                                  setContextMenuOpen(null);

                                  addActiveWindow({
                                    id: crypto.randomUUID(),
                                    title: "Text Editor",
                                    icon: textEditorIcon,
                                    children: (
                                      <TextEditor
                                        startFilePath={`${pathFound}${entry.name}`}
                                      />
                                    ),
                                    isMinimized: false,
                                    isFullscreen: false,
                                    isFocused: true,
                                  });
                                }}
                              />
                              <Action
                                label="Image Viewer"
                                onClick={() => {
                                  setContextMenuOpen(null);
                                  openFile(`${pathFound}${entry.name}`);
                                }}
                              />
                            </Action>
                          )}

                          {(isImageFile(entry.name) ||
                            isVideoFile(entry.name)) && (
                            <Action
                              label="Set as Background"
                              onClick={() => {
                                setContextMenuOpen(null);
                                setCurrentBackground(
                                  `${pathFound}${entry.name}`,
                                );
                              }}
                            />
                          )}
                        </>
                      )}
                      {/* Dir options */}
                      {entry.type === "dir" && (
                        <>
                          <Action
                            label="Navigate"
                            onClick={() => {
                              setContextMenuOpen(null);
                              setPathInputState(`${pathFound}${entry.name}`);
                            }}
                          />
                          <Action
                            label="Open in new File Manager"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setContextMenuOpen(null);
                              openFile(`${pathFound}${entry.name}`);
                            }}
                          />
                        </>
                      )}
                      {/* Always appears */}
                      <Action
                        label="Delete"
                        danger={true}
                        onClick={() => {
                          handleDelete(entry.name);
                          setContextMenuOpen(null);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
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
      <div className="storage-estimate-display">
        Usage: {formatBytes(storageEstimate.usage)}/
        {formatBytes(storageEstimate.quota)} (~
        {Math.ceil((storageEstimate.usage / storageEstimate.quota) * 100)}
        %)
      </div>
    </div>
  );
}
