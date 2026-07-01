import "./terminal.scss";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { useTime } from "../../hooks";
import { doesDirExist } from "../../vfs-actions/doesDirExist";
import { touch } from "../../vfs-actions/touch";
import { mkdir } from "../../vfs-actions/mkdir";
import { ls } from "../../vfs-actions/ls";

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

  const runCommand = async (
    command: string,
  ): Promise<string | ReactNode | null> => {
    console.log(`Running command: ${command}`);
    setCommandHistory([...commandHistory, command]);

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
        if (parts.length > 1)
          return (
            <span style={{ color: "red" }}>
              Error: "history" command accepts no arguments
            </span>
          );
        if (commandHistory.length === 0) return "";
        return commandHistory.join("\n");

      case "ls":
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

      case "touch":
        if (!parts[1]) {
          return "Error: No filename provided.";
        } else {
          const remainingParts = parts.slice(1);
          for (const part of remainingParts) {
            await touch(`${currentPath}${part}`);
          }
          return "";
        }

      case "mkdir":
        if (!parts[1]) {
          return "Error: No directory name provided.";
        } else {
          const remainingParts = parts.slice(1);
          for (const part of remainingParts) {
            await mkdir(`${currentPath}${part}`);
          }
          return "";
        }

      case "cd":
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
        return `Command not found: ${parts[0]}`;
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
          enterKeyHint="done"
          autoFocus
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
