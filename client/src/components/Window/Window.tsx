import "./window.scss";
import { useUIStore, useWindowStore } from "../../store";
import { useState, useEffect, useRef, type ReactNode } from "react";
import fullscreenIcon from "../../assets/icons/fullscreen.svg";
import exitFullscreenIcon from "../../assets/icons/exit-fullscreen.svg";
import closeIcon from "../../assets/icons/close-x.svg";
import minimizeIcon from "../../assets/icons/minimize.svg";
import left50 from "../../assets/icons/left-50.svg";
import right50 from "../../assets/icons/right-50.svg";
import top50 from "../../assets/icons/top-50.svg";
import bottom50 from "../../assets/icons/bottom-50.svg";
import type { TaskbarPosition } from "../../types/TaskbarPosition";

interface WindowProps {
  index: number;
  id: string;
  icon: string;
  title: string;
  children: ReactNode | null;
  isMinimized: boolean;
  isFullscreen: boolean;
  isFocused: boolean;
}

export default function Window({
  index,
  id,
  icon,
  title,
  children,
  isMinimized,
  isFullscreen,
  isFocused,
}: WindowProps) {
  const taskbarPosition = useUIStore((s) => s.taskbarPosition);
  const activeWindows = useWindowStore((s) => s.activeWindows);
  const removeActiveWindow = useWindowStore((s) => s.removeActiveWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const [isFullScreenLocal, setIsFullScreen] = useState<boolean>(isFullscreen);
  const [moveMenuOpen, setMoveMenuOpen] = useState<boolean>(false);
  const [halfPortion, setHalfPortion] = useState<TaskbarPosition | null>(null);

  // ---- drag state (fully local, no store writes mid-drag) ----
  const windowRef = useRef<HTMLDivElement>(null);
  const dragData = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });
  const rafId = useRef<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isFocused) setMoveMenuOpen(false);
  }, [isFocused]);

  // clean up in case the component unmounts mid-drag
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragData.current.dragging) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const { startX, startY, origX, origY } = dragData.current;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const node = windowRef.current;
      if (node) {
        node.style.left = `${origX + dx}px`;
        node.style.top = `${origY + dy}px`;
      }
    });
  };

  const handlePointerUp = (e: PointerEvent) => {
    dragData.current.dragging = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const { startX, startY, origX, origY } = dragData.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    setPos({ x: origX + dx, y: origY + dy });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const node = windowRef.current;
    let startPos = pos;

    // coming out of fullscreen/snap: capture the real on-screen position
    // *before* clearing those states, so the resulting re-render doesn't jump
    if (node && (isFullScreenLocal || halfPortion)) {
      startPos = { x: node.offsetLeft, y: node.offsetTop };
      setPos(startPos);
      setIsFullScreen(false);
      setHalfPortion(null);
    }

    focusWindow(id);

    dragData.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: startPos.x,
      origY: startPos.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
      ref={windowRef}
      className={`window ${taskbarPosition} ${isFullScreenLocal ? "fullscreen" : ""} ${isMinimized ? "minimized" : ""} ${isFocused ? "focused" : ""}`}
      style={{
        top:
          isFullScreenLocal || halfPortion === "top"
            ? 0
            : halfPortion
              ? ""
              : pos.y,
        bottom: halfPortion === "bottom" ? 0 : "",
        left:
          isFullScreenLocal || halfPortion === "left"
            ? 0
            : halfPortion
              ? ""
              : pos.x,
        right: halfPortion === "right" ? 0 : "",

        width: isFullScreenLocal
          ? "100%"
          : ["left", "right"].includes(String(halfPortion))
            ? "50%"
            : ["top", "bottom"].includes(String(halfPortion))
              ? "100%"
              : "",
        height: isFullScreenLocal
          ? "100%"
          : ["left", "right"].includes(String(halfPortion))
            ? "100%"
            : ["top", "bottom"].includes(String(halfPortion))
              ? "50%"
              : "",

        zIndex: isFocused ? activeWindows.length : index,
        borderRadius: isFullScreenLocal || halfPortion ? 0 : "",
      }}
      onClick={() => {
        focusWindow(id);
        setMoveMenuOpen(false);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        focusWindow(id);
      }}
    >
      <div className="window-title-bar" onPointerDown={handlePointerDown}>
        <div className="window-info">
          <div className="window-icon">
            <img src={icon} />
          </div>
          <p className="window-title">{title}</p>
        </div>

        <div className="window-actions">
          <div
            className="window-minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              minimizeWindow(id);
            }}
          >
            <img src={minimizeIcon} />
          </div>
          <div
            className="window-fullscreen"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setIsFullScreen(!isFullScreenLocal);
              focusWindow(id);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setMoveMenuOpen(true);
            }}
          >
            <img
              src={isFullScreenLocal ? exitFullscreenIcon : fullscreenIcon}
            />
            {moveMenuOpen && (
              <div
                className="move-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoveMenuOpen(false);
                  setIsFullScreen(false);
                }}
              >
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("top");
                  }}
                >
                  <img src={top50} />
                </div>
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("right");
                  }}
                >
                  <img src={right50} />
                </div>
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("left");
                  }}
                >
                  <img src={left50} />
                </div>
                <div
                  className="section"
                  onClick={() => {
                    setHalfPortion("bottom");
                  }}
                >
                  <img src={bottom50} />
                </div>
              </div>
            )}
          </div>
          <div
            className="window-close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => removeActiveWindow(id)}
          >
            <img src={closeIcon} />
          </div>
        </div>
      </div>

      <div className="window-main">{children}</div>
    </div>
  );
}
