import "./filemanager.scss";
import { useState, useEffect } from "react";
import { VFS_ROOT } from "../../constants/constants";
import { ls } from "../../vfs-actions/ls";
import { touch } from "../../vfs-actions/touch";
import { mkdir } from "../../vfs-actions/mkdir";
import { getFileIcon } from "../../helpers/getFileIcon";
import { getValidFileName } from "../../helpers/getValidFileName";
import { formatBytes } from "../../helpers/formatBytes";
import homeIcon from "../../assets/icons/home.svg";
import backIcon from "../../assets/icons/go-back.svg";
import { useFileSystemChanged } from "../../hooks/useFileSystemChanged";

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (creatingEntryName.trim() === "") {
      return;
    }

    if (creatingEntryType === null) return;

    try {
      if (creatingEntryType === "dir") {
        const result = await mkdir(
          `${pathFound}${getValidFileName(creatingEntryName)}`,
        );
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

  useEffect(() => {
    fetchPath(pathInputState);
  }, [pathInputState]);

  useFileSystemChanged(() => fetchPath(pathFound));

  return (
    <div className="file-manager">
      <div className="form-container">
        <div className="options-bar">
          <p className="option" onClick={() => setCreatingEntryType("file")}>
            <PlusIcon />
            <FileIcon />
          </p>
          <p className="option" onClick={() => setCreatingEntryType("dir")}>
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
              }}
            >
              <img src={backIcon} />
            </div>
            <div className="go-home" onClick={() => setPathInputState("/")}>
              <img src={homeIcon} />
            </div>
          </div>
        </div>
      </div>
      <div className="entries-container">
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
              <div
                key={index}
                className="file-manager-entry"
                onClick={() => {
                  if (entry.type === "dir") {
                    setPathInputState(`${pathFound}${entry.name}/`);
                  }
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
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      className="plus-icon"
      fill="#ffffff"
      width="64px"
      height="64px"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <polygon points="9 4.1 5.9 4.1 5.9 1 4.1 1 4.1 4.1 1 4.1 1 5.9 4.1 5.9 4.1 9 5.9 9 5.9 5.9 9 5.9 9 4.1" />{" "}
        </g>{" "}
      </g>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="file-icon"
      fill="#ffffff"
      width="75"
      height="75"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      transform="matrix(-1, 0, 0, 1, 0, 0)"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        <g>
          <path fillRule="evenodd" d="M8,1V6H3v9H13V1ZM7,1,3,5H7Z" />
        </g>
      </g>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      className="folder-icon"
      fill="#ffffff"
      width="75px"
      height="75px"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      transform="matrix(1, 0, 0, 1, 0, 0)"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        {" "}
        <g>
          {" "}
          <path d="M9,5A2.51,2.51,0,0,0,6.5,3H1V14H15V5Z" />{" "}
        </g>{" "}
      </g>
    </svg>
  );
}
