import "./audioplayer.scss";
import { useState, useEffect, useRef } from "react";
import { getFileFromPath } from "../../vfs-actions/getFileFromPath";

export default function AudioPlayer({
  startFilePath = null,
}: {
  startFilePath?: string | null;
}) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!startFilePath) return;

    let currentUrl: string | null = null;

    async function loadAudio(filePath: string) {
      try {
        const file = await getFileFromPath(filePath);

        const url = URL.createObjectURL(file);

        currentUrl = url;

        setFileName(file.name);
        setAudioSrc(url);
      } catch (err) {
        console.error(err);
      }
    }

    loadAudio(startFilePath);

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [startFilePath]);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;

    if (!audio || !canvas || !audioSrc) return;

    const ctx = new AudioContext();

    const source = ctx.createMediaElementSource(audio);

    const analyser = ctx.createAnalyser();
    // analyser.fftSize = 256;
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.85;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvasCtx = canvas.getContext("2d");

    if (!canvasCtx) return;

    let animationFrameId: number;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      canvasCtx.clearRect(0, 0, width, height);

      canvasCtx.fillStyle = "white";
      canvasCtx.strokeStyle = "white";

      if (audio.paused) {
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      const bars = 64;

      const step = Math.max(1, Math.floor(bufferLength / bars));

      // Visualizer occupies 90% of canvas width
      const visualizerWidth = width * 0.8;

      const startX = (width - visualizerWidth) / 2;

      // Responsive gap and bar sizing
      const barGap = visualizerWidth * 0.004;

      const barWidth = (visualizerWidth - (bars - 1) * barGap) / bars;

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step];

        const barHeight = (value / 255) * height;

        canvasCtx.fillRect(
          startX + i * (barWidth + barGap),
          height - barHeight,
          barWidth,
          barHeight,
        );
      }
    };

    draw();

    const resumeAudioContext = () => {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    };

    audio.addEventListener("play", resumeAudioContext);

    return () => {
      cancelAnimationFrame(animationFrameId);
      audio.removeEventListener("play", resumeAudioContext);
      ctx.close();
    };
  }, [audioSrc]);

  return (
    <div className="audio-player">
      <div className="file-name-display">
        {fileName
          ? fileName
          : startFilePath !== null && fileName === null
            ? "Loading..."
            : ""}
      </div>

      <div className="player-main">
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "150px",
            display: "block",
          }}
        />

        <audio ref={audioRef} src={audioSrc ?? undefined} controls autoPlay />
      </div>

      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
