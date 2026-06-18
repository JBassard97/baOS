import "./filemanager.scss";
import { useState, useEffect } from "react";
import { VFS_ROOT } from "../../constants/constants";
import { ls } from "../../vfs-actions/ls";
import { getFileIcon } from "../../helpers/getFileIcon";

export default function FileManager() {
  const [pathInputState, setPathInputState] = useState<string>(VFS_ROOT);
  const [entriesFound, setEntriesFound] = useState([]);
  const [pathFound, setPathFound] = useState<string>(VFS_ROOT);

  async function fetchPath(path: string) {
    try {
      const result = await ls(path);
      if (result.entries) {
        setEntriesFound(result.entries);
        setPathFound(result.path);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPath(pathInputState);
  }, [pathInputState]);

  return (
    <div className="file-manager">
      <div className="form-container">
        <input
          type="text"
          name="path-input"
          id="path-input"
          value={pathInputState}
          onChange={(e) => setPathInputState(e.target.value)}
        />
        <p className="status-bar">Entries Found: {entriesFound.length}</p>
      </div>
      <div className="entries-container">
        {entriesFound.length > 0 &&
          entriesFound.map((entry: { name: string; type: string }, index) => (
            <div
              key={index}
              className="file-manager-entry"
              onClick={() => {
                if (entry.type === "dir") {
                  setPathInputState(`${pathFound}${entry.name}/`);
                }
              }}
            >
              <img src={getFileIcon(entry.name, entry.type === "dir")} />
              <div className="entry-text">
                <p className="entry-name">
                  {entry.name}
                  {entry.type === "dir" && "/"}
                </p>
                <p className="entry-type">Type: "{entry.type}"</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
