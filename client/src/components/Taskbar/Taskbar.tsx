import { lazy, Suspense } from "react";
import "./taskbar.scss";
import StartButton from "../StartButton/StartButton";
import SmallDateClock from "../SmallDateClock/SmallDateClock";
import FullscreenButton from "../FullscreenButton/FullscreenButton";
import TaskbarPositionSetter from "../TaskbarPositionSetter/TaskbarPositionSetter";
import TaskbarItem from "../TaskbarItem/TaskbarItem";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import { useUIStore } from "../../store";
import fileManagerIcon from "../../assets/icons/file-manager.svg";
import terminalIcon from "../../assets/icons/terminal.svg";
import settingsIcon from "../../assets/icons/settings-icon.svg";
import baosIcon from "../../assets/icons/baosNeon.png";
import devPanelIcon from "../../assets/icons/nut.svg";
import calculatorIcon from "../../assets/icons/calculator.svg";
import imageViewerIcon from "../../assets/icons/image-viewer.svg";
import videoPlayerIcon from "../../assets/icons/video-player.svg";
import meowMasherIcon from "../../assets/icons/meowmasher.png";
import { getOrientation } from "../../helpers";
import wikipediaIcon from "../../assets/icons/Wikipedia-logo-v2.svg";
import googleIcon from "../../assets/icons/google-icon.svg";
import textEditorIcon from "../../assets/icons/text-editor.svg";
import strudelLogo from "../../assets/icons/strudel-logo.png";
import audioPlayerIcon from "../../assets/icons/audio-player-icon.svg";
import desmosScientificIcon from "../../assets/icons/desmos-scientific.png";

const LazyFileManager = lazy(
  () => import("../../applications/FileManager/FileManager"),
);
const LazyTerminal = lazy(() => import("../../applications/Terminal/Terminal"));
const LazyDevPanel = lazy(() => import("../../applications/DevPanel/DevPanel"));
const LazyTextEditor = lazy(
  () => import("../../applications/TextEditor/TextEditor"),
);
const LazyVideoPlayer = lazy(
  () => import("../../applications/VideoPlayer/VideoPlayer"),
);
const LazyAudioPlayer = lazy(
  () => import("../../applications/AudioPlayer/AudioPlayer"),
);
const LazySettings = lazy(() => import("../../applications/Settings/Settings"));

function LazyLoadedWindow({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className="window-loading"
          style={{ width: "100%", height: "100%", background: "black" }}
        ></div>
      }
    >
      {children}
    </Suspense>
  );
}

const iframeApps = {
  google: {
    icon: googleIcon,
    title: "Google",
    src: "https://www.google.com/webhp?igu=1",
    isFullscreen: true,
  },
  wikipedia: {
    icon: wikipediaIcon,
    title: "Wikipedia",
    src: "https://www.wikipedia.org/",
    isFullscreen: false,
  },
  meowMasher: {
    icon: meowMasherIcon,
    title: "Meow Masher",
    src: "https://jbassard97.github.io/MeowMasher/",
    isFullscreen: true,
  },
  strudel: {
    icon: strudelLogo,
    title: "Strudel",
    src: "https://strudel.cc",
    isFullscreen: true,
  },
  desmosScientific: {
    icon: desmosScientificIcon,
    title: "Desmos Scientific",
    src: "https://www.desmos.com/scientific",
    isFullscreen: false,
  },
};

function Taskbar() {
  const position = useUIStore((s) => s.taskbarPosition);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  const setStartMenuOpen = useUIStore((s) => s.setStartMenuOpen);

  const closeStartMenuIfOpen = () => {
    if (startMenuOpen) setStartMenuOpen(false);
  };

  return (
    <div
      className={`taskbar ${getOrientation(position)} ${position} ${startMenuOpen && "open"}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeStartMenuIfOpen();
        }
      }}
    >
      <div className="taskbar-main">
        <div className="left-or-top-group">
          <StartButton />
          <TaskbarItem
            icon={fileManagerIcon}
            title={"File Manager"}
            children={
              <LazyLoadedWindow>
                <LazyFileManager />
              </LazyLoadedWindow>
            }
          />
        </div>
        <div className="right-or-bottom-group">
          <TaskbarPositionSetter />
          <FullscreenButton />
          <SmallDateClock />
        </div>
      </div>
      {startMenuOpen && (
        <div className="start-menu">
          <div className="start-menu-title-bar">
            <div className="left-section">
              <span className="start-menu-title">
                <img src={baosIcon} />
                Start Menu
              </span>
            </div>
            <div className="right-section">
              <div
              // onClick={() => {
              //   setStartMenuOpen(false);
              // }}
              >
                <TaskbarItem
                  icon={settingsIcon}
                  title="Settings"
                  children={
                    <LazyLoadedWindow>
                      <LazySettings />
                    </LazyLoadedWindow>
                  }
                  isFullscreen={true}
                />
              </div>
            </div>
          </div>

          <div className="start-menu-middle">
            <WeatherWidget />
          </div>

          <div className="main-sections">
            <div className="start-menu-section">
              <div className="section-title-bar">
                <span>Utilities</span>
              </div>
              <div className="section-container">
                <div>
                  <TaskbarItem
                    icon={fileManagerIcon}
                    title={"File Manager"}
                    children={
                      <LazyLoadedWindow>
                        <LazyFileManager />
                      </LazyLoadedWindow>
                    }
                    dontShowTooltip={true}
                  />
                  <p className="item-name">File Manager</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={terminalIcon}
                    title={"Terminal"}
                    children={
                      <LazyLoadedWindow>
                        <LazyTerminal />
                      </LazyLoadedWindow>
                    }
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Terminal</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={devPanelIcon}
                    title={"Dev Panel"}
                    children={
                      <LazyLoadedWindow>
                        <LazyDevPanel />
                      </LazyLoadedWindow>
                    }
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Dev Panel</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={calculatorIcon}
                    title="Calculator"
                    children={<h2>Calculator</h2>}
                    dontShowTooltip={true}
                  />
                  <p
                    className="item-name"
                    style={{ textDecoration: "line-through" }}
                  >
                    Calculator
                  </p>
                </div>
                <div>
                  <TaskbarItem
                    icon={textEditorIcon}
                    title="Text Editor"
                    children={
                      <LazyLoadedWindow>
                        <LazyTextEditor />
                      </LazyLoadedWindow>
                    }
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Text Editor</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={imageViewerIcon}
                    title="Image Viewer"
                    children={<h2>Image Viewer</h2>}
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Image Viewer</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={videoPlayerIcon}
                    title="Video Player"
                    children={
                      <LazyLoadedWindow>
                        <LazyVideoPlayer />
                      </LazyLoadedWindow>
                    }
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Video Player</p>
                </div>
                <div>
                  <TaskbarItem
                    icon={audioPlayerIcon}
                    title="Audio Player"
                    children={
                      <LazyLoadedWindow>
                        <LazyAudioPlayer />
                      </LazyLoadedWindow>
                    }
                    dontShowTooltip={true}
                  />
                  <p className="item-name">Audio Player</p>
                </div>
              </div>
            </div>

            <div className="start-menu-section">
              <div className="section-title-bar">
                <span>Applications</span>
              </div>
              <div className="section-container">
                {Object.values(iframeApps).map((app, index) => (
                  <div key={index}>
                    <TaskbarItem
                      icon={app.icon}
                      title={app.title}
                      children={
                        <iframe
                          src={app.src}
                          width="100%"
                          height="100%"
                          style={{ border: "none", display: "block" }}
                        />
                      }
                      isFullscreen={app.isFullscreen ?? false}
                      dontShowTooltip={true}
                    />
                    <p className="item-name">{app.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Taskbar;
