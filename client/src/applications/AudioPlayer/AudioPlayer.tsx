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

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

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

  function setupVisualizer() {
    const audio = audioRef.current;
    const canvas = canvasRef.current;

    if (!audio || !canvas) return;

    // Already initialized
    if (audioContextRef.current) {
      audioContextRef.current.resume();
      return;
    }

    const ctx = new AudioContext();

    const source = ctx.createMediaElementSource(audio);

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.85;

    source.connect(analyser);
    analyser.connect(ctx.destination);

    audioContextRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;

    drawVisualizer();
  }

  function drawVisualizer() {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !audio || !analyser) return;

    const canvasCtx = canvas.getContext("2d");

    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

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

      const visualizerWidth = width * 0.77;

      const startX = (width - visualizerWidth) / 2;

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
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      audioContextRef.current?.close();
    };
  }, []);

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

        <audio
          ref={audioRef}
          src={audioSrc ?? undefined}
          controls
          onPlay={setupVisualizer}
        />
      </div>

      <div className="file-path-display">
        {startFilePath === null ? "No file provided..." : `"${startFilePath}"`}
      </div>
    </div>
  );
}
