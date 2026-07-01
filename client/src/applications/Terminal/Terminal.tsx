import "./terminal.scss";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { useTime } from "../../hooks";
import { doesDirExist } from "../../vfs-actions/doesDirExist";
import { touch } from "../../vfs-actions/touch";
import { mkdir } from "../../vfs-actions/mkdir";
import { ls } from "../../vfs-actions/ls";
import { rm } from "../../vfs-actions/rm";

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

  const COMMANDS: Record<string, { description: string }> = {
    pwd: { description: "Print working directory" },
    ls: { description: "List directory contents" },
    cd: { description: "Change directory" },
    touch: { description: "Create file(s)" },
    mkdir: { description: "Create directory(ies)" },
    rm: { description: "Remove files or directories" },
    echo: { description: "Print text to output" },
    date: { description: "Show current date and time" },
    curl: { description: "Fetch a URL via HTTP GET" },
    clear: { description: "Clear terminal history" },
    history: { description: "Show command history" },
    help: { description: "Show commands and descriptions" },
  };

  const runCommand = async (
    command: string,
  ): Promise<string | ReactNode | null> => {
    console.log(`Running command: ${command}`);
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
        if (parts.length > 1)
          return (
            <ErrorMessage
              message={`"history" command accepts 0 arguments but got ${parts.length - 1}`}
            />
          );
        if (commandHistory.length === 0) return "";
        return commandHistory.join("\n");

      case "echo":
        if (parts.length === 1) return "";
        return parts.slice(1).join(" ");

      case "date":
        if (parts.length > 1) {
          return (
            <ErrorMessage
              message={`"date" command accepts 0 arguments but got ${parts.length - 1}`}
            />
          );
        }

        return new Date().toString();

      case "help":
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
                <th>COMMAND</th>
                <th>DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(COMMANDS).map(([cmd, info]) => (
                <tr key={cmd}>
                  <td className="help-cmd">{cmd}</td>
                  <td>{info.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

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

      case "rm":
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
        if (!parts[1]) {
          return <ErrorMessage message="No file name provided" />;
        } else {
          const remainingParts = parts.slice(1);
          for (const part of remainingParts) {
            await touch(`${currentPath}${part}`);
          }
          return "";
        }

      case "mkdir":
        if (!parts[1]) {
          return <ErrorMessage message="No directory name provided" />;
        } else {
          const remainingParts = parts.slice(1);
          for (const part of remainingParts) {
            await mkdir(`${currentPath}${part}`);
          }
          return "";
        }

      case "curl":
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
  return <span style={{ color: "red" }}>Error: {message}</span>;
}
