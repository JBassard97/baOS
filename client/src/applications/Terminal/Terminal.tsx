import "./terminal.scss";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { useTime } from "../../hooks";
import { doesDirExist } from "../../vfs-actions/doesDirExist";
// import { doesFileExist } from "../../vfs-actions/doesFileExist";
import { touch } from "../../vfs-actions/touch";
import { mkdir } from "../../vfs-actions/mkdir";
import { ls } from "../../vfs-actions/ls";
import { rm } from "../../vfs-actions/rm";
import {
  uploadFilesToVFS,
  uploadFolderToVFS,
} from "../../vfs-actions/uploadToVfs";
import { openFile } from "../../utils/openFile";
import { getValidFileName } from "../../helpers";

interface HistoryEntry {
  time: string;
  input: string;
  output: string | ReactNode;
  path: string;
}

function resolvePath(currentPath: string, targetPath: string): string {
  // Absolute path starts from root
  const segments = targetPath.startsWith("/")
    ? []
    : currentPath.split("/").filter(Boolean);

  for (const part of targetPath.split("/").filter(Boolean)) {
    if (part === ".") {
      continue;
    }

    if (part === "..") {
      if (segments.length > 0) {
        segments.pop();
      }
      continue;
    }

    segments.push(part);
  }

  return segments.length === 0 ? "/" : `/${segments.join("/")}/`;
}

export default function Terminal() {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [inputState, setInputState] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalMainRef = useRef<HTMLDivElement>(null);

  const now = useTime();

  const currentTime = now.toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    terminalMainRef.current?.scrollTo({
      top: terminalMainRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  const COMMANDS: Record<
    string,
    { alt?: string; args?: string; description: string }
  > = {
    pwd: { description: "Print working directory" },
    ls: { alt: "whatishere", description: "List directory contents" },
    cd: {
      alt: "goto",
      args: "path?",
      description: "Change directory",
    },
    touch: { alt: "newfile", args: "...files", description: "Create file(s)" },
    mkdir: {
      alt: "newfolder",
      args: "...dirs",
      description: "Create directory(ies)",
    },
    upload: {
      args: "`file`|`folder`",
      description: "Upload file or folder to the current directory",
    },
    rm: {
      alt: "delete",
      args: "file|dir",
      description: "Remove files or directories recursively",
    },
    open: {
      args: "file|dir",
      description: "Open file or folder with the respective app",
    },
    echo: {
      alt: "print",
      args: "...args",
      description: "Print text to output",
    },
    date: { alt: "whenisit", description: "Show current date and time" },
    location: { alt: "whereami", description: "Print IP-derived location" },
    curl: {
      alt: "fetch",
      args: "url",
      description: "Fetch URL via HTTP GET",
    },
    clear: { description: "Clear terminal history" },
    history: { alt: "whathappened", description: "Show command history" },
    help: { alt: "?", description: "Show commands and descriptions" },
  };

  const runCommand = async (
    command: string,
  ): Promise<string | ReactNode | null> => {
    // console.log(`Running command: ${command}`);
    setCommandHistory((prev) => [...prev, command]);

    const parts = command.trim().split(/\s+/);

    switch (parts[0]) {
      case "":
        return "";

      case "clear":
        setHistory([]);
        setInputState("");
        return null;

      case "pwd":
        return currentPath;

      case "history":
      case "whathappened":
        if (parts.length > 1)
          return (
            <ErrorMessage
              message={`"history" command accepts 0 arguments but got ${parts.length - 1}`}
            />
          );
        if (commandHistory.length === 0) return "";
        return commandHistory.join("\n");

      case "open":
        if (!parts[1]) {
          return <ErrorMessage message="No file or directory name provided" />;
        } else if (parts.length > 2) {
          return (
            <ErrorMessage
              message={`"open" command accepts 1 arguments but got ${parts.length - 1}`}
            />
          );
        } else {
          try {
            await openFile(`${currentPath}${parts[1]}`);
            return "";
          } catch (err) {
            return <ErrorMessage message={String(err)} />;
          }
        }

      case "echo":
      case "print":
        if (parts.length === 1) return "";
        return parts.slice(1).join(" ");

      case "date":
      case "whenisit":
        if (parts.length > 1) {
          return (
            <ErrorMessage
              message={`"date" command accepts 0 arguments but got ${parts.length - 1}`}
            />
          );
        }

        return new Date().toString();

      case "location":
      case "whereami":
        if (parts.length > 1) {
          return (
            <ErrorMessage
              message={`"location" command accepts 0 arguments but got ${parts.length - 1}`}
            />
          );
        }
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();

          return `${data.city}\n${data.region}\n${data.country_name}`;
        } catch (err) {
          return <ErrorMessage message={String(err)} />;
        }

      case "help":
      case "?":
        if (parts.length > 1) {
          return (
            <ErrorMessage
              message={`"help" command accepts 0 arguments but got ${parts.length - 1}`}
            />
          );
        }

        return (
          <table className="help-table">
            <thead>
              <tr>
                <th>CMD</th>
                <th>ALT</th>
                <th>ARGS</th>
                <th>DESC</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(COMMANDS).map(([cmd, info]) => (
                <tr key={cmd}>
                  <td className="help-cmd">{cmd}</td>
                  <td className="help-alt">{info.alt ?? ""}</td>
                  <td className="help-args">{info.args ?? ""}</td>
                  <td>{info.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "ls":
      case "whatishere":
        const { entries } = await ls(currentPath);
        if (entries.length === 0) return "";
        return (
          <div>
            {entries.map((entry, i) => (
              <div key={i}>
                {entry.type === "dir" ? (
                  <span style={{ color: "lime" }}>{entry.name}/</span>
                ) : (
                  <span>{entry.name}</span>
                )}
              </div>
            ))}
          </div>
        );

      case "rm":
      case "delete":
        if (!parts[1]) {
          return <ErrorMessage message="No file or directory name provided" />;
        } else if (parts.length > 2) {
          return (
            <ErrorMessage
              message={`"rm" command accepts 1 arguments but got ${parts.length - 1}`}
            />
          );
        } else {
          await rm(`${currentPath}${parts[1]}`);
          return "";
        }

      case "touch":
      case "newfile":
        if (!parts[1]) {
          return <ErrorMessage message="No file name provided" />;
        } else {
          const remainingParts = parts.slice(1);
          for (const part of remainingParts) {
            await touch(`${currentPath}${getValidFileName(part)}`);
          }
          return "";
        }

      case "mkdir":
      case "newfolder":
        if (!parts[1]) {
          return <ErrorMessage message="No directory name provided" />;
        } else {
          const remainingParts = parts.slice(1);
          for (const part of remainingParts) {
            await mkdir(`${currentPath}${part}`);
          }
          return "";
        }

      case "upload":
        if (!parts[1]) {
          return (
            <ErrorMessage message="No upload type (`file`|`folder`) provided" />
          );
        } else if (parts.length > 2) {
          return (
            <ErrorMessage
              message={`"upload" command accepts 1 argument but got ${parts.length - 1}`}
            />
          );
        } else if (parts[1] !== "file" && parts[1] !== "folder") {
          return (
            <ErrorMessage message="Upload type can only be `file` or `folder`" />
          );
        } else {
          if (parts[1] === "file") {
            await uploadFilesToVFS(currentPath);
          }

          if (parts[1] === "folder") {
            await uploadFolderToVFS(currentPath);
          }

          return "";
        }

      case "curl":
      case "fetch":
        if (!parts[1]) {
          return <ErrorMessage message="No URL provided" />;
        } else if (parts.length > 2) {
          if (parts.length !== 2) {
            return (
              <ErrorMessage message='"curl" requires exactly 1 URL argument' />
            );
          }
        }
        try {
          let url = parts[1];
          if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = `https://${url}`;
          }

          const response = await fetch(url);
          const text = await response.text();
          return text;
        } catch (err) {
          console.error(err);
          return (
            <span style={{ color: "red" }}>
              Error: {err instanceof Error ? err.message : String(err)}
            </span>
          );
        }

      case "cd":
      case "goto":
        if (parts.length > 2) {
          return (
            <span style={{ color: "red" }}>
              Error: "cd" command accepts 0 or 1 arguments but got{" "}
              {parts.length - 1}.
            </span>
          );
        }
        if (!parts[1] || parts[1] === "~" || parts[1] === "/") {
          setCurrentPath("/");
          return "";
        }

        const resolvedPath = resolvePath(currentPath, parts[1]);
        const dirExists = await doesDirExist(resolvedPath);

        if (!dirExists) {
          //   return `Error: Directory "${parts[1]}" does not exist.`;
          return (
            <span style={{ color: "red" }}>
              Error: "{parts[1]}" does not exist.
            </span>
          );
        }

        setCurrentPath(resolvedPath);
        return "";

      default:
        return (
          <span style={{ color: "red" }}>Command not found: "{parts[0]}"</span>
        );
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const command = inputState.trim();

    const output = await runCommand(command);

    if (output === null) {
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        input: command,
        path: currentPath,
        time: currentTime,
        output,
      },
    ]);

    setHistoryIndex(-1);
    setInputState("");
  };

  return (
    <div className="terminal">
      <div className="terminal-main" ref={terminalMainRef}>
        {history.map((historyEntry, index) => (
          <div key={index} className="history-entry">
            <PathDisplay path={historyEntry.path} time={historyEntry.time} />

            <p className="history-input">{`$ ${historyEntry.input}`}</p>

            {historyEntry.output && (
              <div className="history-output">{historyEntry.output}</div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <PathDisplay time={currentTime} path={currentPath} />

        <input
          className="terminal-input"
          type="text"
          value={inputState}
          onChange={(e) => {
            setInputState(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();

              if (commandHistory.length === 0) return;

              const newIndex =
                historyIndex === -1
                  ? commandHistory.length - 1
                  : Math.max(0, historyIndex - 1);

              setHistoryIndex(newIndex);
              setInputState(commandHistory[newIndex]);
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();

              if (historyIndex === -1) return;

              const newIndex = historyIndex + 1;

              if (newIndex >= commandHistory.length) {
                setHistoryIndex(-1);
                setInputState("");
              } else {
                setHistoryIndex(newIndex);
                setInputState(commandHistory[newIndex]);
              }
            }
          }}
          enterKeyHint="done"
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}

function PathDisplay({ path, time }: { path: string; time: string }) {
  return (
    <div className="path-display">
      <span className="path-display-time">{`[${time}]`}</span>
      <span className="path-display-path">{path}</span>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <span style={{ color: "red" }}>{message}</span>;
}
