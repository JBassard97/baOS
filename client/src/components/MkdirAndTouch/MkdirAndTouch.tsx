import "./mkdirandtouch.scss";
// import { mkdir } from "../../vfs-actions/mkdir";
// import { touch } from "../../vfs-actions/touch";
import { useUIStore } from "../../store/useUIStore";
import { useDesktopStore } from "../../store/useDesktopStore";

export default function MkdirAndTouch() {
  const taskbarPosition = useUIStore((state) => state.taskbarPosition);
  const setCreatingDesktopEntry = useDesktopStore(
    (state) => state.setCreatingDesktopEntry,
  );
  const setSelectedEntry = useDesktopStore((state) => state.setSelectedEntry);
  const setContextMenuEntry = useDesktopStore(
    (state) => state.setContextMenuEntry,
  );
  const setDesktopContextMenu = useDesktopStore(
    (state) => state.setDesktopContextMenu,
  );

  function startMakingDesktopEntry(creatingType: "file" | "dir") {
    setSelectedEntry(null);
    setContextMenuEntry(null);
    setDesktopContextMenu({ visible: false, x: 0, y: 0, entry: null });
    setCreatingDesktopEntry({
      isCreatingDesktopEntry: true,
      creatingType: creatingType,
    });
  }

  return (
    <div className={`mkdir-and-touch ${taskbarPosition}`}>
      <div
        className="touch-button"
        onClick={() => {
          startMakingDesktopEntry("file");
        }}
      >
        <PlusIcon />
        <FileIcon />
      </div>
      <div
        className="mkdir-button"
        onClick={() => {
          startMakingDesktopEntry("dir");
        }}
      >
        <PlusIcon />
        <FolderIcon />
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
