import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  Film,
  Zap,
} from "lucide-react";
import { EpisodeProject, SceneItem } from "../types";
import { playSoundEffect } from "../utils/soundEffects";

interface AnimaticTheaterProps {
  episode: EpisodeProject;
  onNavigateToFactory: () => void;
}

export const AnimaticTheater: React.FC<AnimaticTheaterProps> = ({
  episode,
  onNavigateToFactory,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 in current scene

  const currentScene = episode.scenes[currentSceneIndex] || episode.scenes[0];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);

  // Play / Pause toggle
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const jumpToScene = (index: number) => {
    if (index >= 0 && index < episode.scenes.length) {
      setCurrentSceneIndex(index);
      setProgress(0);
      playSoundEffect("click");
    }
  };

  const nextScene = () => {
    if (currentSceneIndex < episode.scenes.length - 1) {
      jumpToScene(currentSceneIndex + 1);
    } else {
      setIsPlaying(false);
      setProgress(100);
      playSoundEffect("chime");
    }
  };

  const prevScene = () => {
    if (currentSceneIndex > 0) {
      jumpToScene(currentSceneIndex - 1);
    } else {
      setProgress(0);
    }
  };

  // When scene changes or playback starts
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    // Trigger scene's sound effect
    if (!isMuted && currentScene.sfx !== "none") {
      playSoundEffect(currentScene.sfx);
    }

    // Play scene audio if available
    if (currentScene.audioWavUrl && !isMuted) {
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = currentScene.audioWavUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log("Audio play error", e));
    }

    // Play video if available
    if (currentScene.videoUrl && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((e) => console.log("Video play error", e));
    }

    const durationMs = (currentScene.durationSeconds || 4) * 1000;
    const intervalMs = 50;
    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed += intervalMs;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);

      if (elapsed >= durationMs) {
        clearInterval(timerRef.current);
        nextScene();
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSceneIndex, isMuted]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Theater Viewport */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
        {/* Top Mini Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-xs font-bold text-white tracking-wide uppercase">
              Teatro Animatic · {episode.title}
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span>
              Escena {currentSceneIndex + 1} de {episode.scenes.length}
            </span>
            <span className="text-sky-400 font-semibold">{currentScene.stage}</span>
          </div>
        </div>

        {/* Screen Canvas (Video or Ken-Burns Animated Image) */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden select-none">
          {currentScene.videoUrl ? (
            <video
              ref={videoRef}
              src={currentScene.videoUrl}
              playsInline
              muted={isMuted}
              className="w-full h-full object-contain"
            />
          ) : currentScene.imageUrl ? (
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
              <img
                src={currentScene.imageUrl}
                alt={currentScene.title}
                className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-out ${
                  isPlaying ? "scale-110 translate-y-[-1%]" : "scale-100"
                }`}
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-sky-400">
                <Film className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">{currentScene.title}</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">{currentScene.visualAction}</p>
              <button
                onClick={onNavigateToFactory}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Generar Cuadro 3D en la Fábrica</span>
              </button>
            </div>
          )}

          {/* Sound Effect Pop Bubble Overlay */}
          {currentScene.sfx !== "none" && (
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-400 text-slate-950 shadow-lg border border-yellow-300 animate-bounce flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>¡{currentScene.sfx}!</span>
              </span>
            </div>
          )}

          {/* Cinematic Subtitle / Comic Dialogue Strip */}
          <div className="absolute bottom-4 inset-x-4 z-20 flex flex-col items-center pointer-events-none">
            {currentScene.dialogue.map((d, i) => (
              <div
                key={i}
                className={`max-w-xl px-4 py-2 rounded-2xl border backdrop-blur-md text-xs font-medium text-center shadow-2xl mb-1.5 animate-in slide-in-from-bottom-2 ${
                  d.speaker === "Saul"
                    ? "bg-slate-950/80 border-sky-500/50 text-sky-100"
                    : d.speaker === "Cesar"
                    ? "bg-slate-950/80 border-amber-500/50 text-amber-100"
                    : "bg-slate-950/80 border-slate-700 text-slate-200"
                }`}
              >
                <span className="font-extrabold text-white mr-1.5">
                  {d.speaker === "Saul" ? "Saúl:" : d.speaker === "Cesar" ? "César:" : "Narrador:"}
                </span>
                <span>"{d.text}"</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar for Current Scene */}
        <div className="w-full bg-slate-950 h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 to-amber-400 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Playback Controls Toolbar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={prevScene}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              title="Escena Anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 flex items-center space-x-2 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? "Pausar" : "Reproducir Episodio"}</span>
            </button>

            <button
              onClick={nextScene}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              title="Siguiente Escena"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => jumpToScene(0)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reiniciar Episodio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
              title={isMuted ? "Activar Audio" : "Silenciar"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Scrubber Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Línea de Tiempo de Escenas (Haz clic para saltar):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {episode.scenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => jumpToScene(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                currentSceneIndex === idx
                  ? "bg-sky-500/20 border-sky-500 text-white shadow-md shadow-sky-500/10 scale-[1.02]"
                  : "bg-slate-950 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>#{s.number}</span>
                <span className="text-amber-400">{s.durationSeconds}s</span>
              </div>
              <span className="text-xs font-bold block truncate">{s.title}</span>
              <span className="text-[9px] block text-slate-400 truncate mt-0.5">{s.stage}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
