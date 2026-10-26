import React, { useState } from "react";
import {
  Clapperboard,
  Sparkles,
  Play,
  Volume2,
  Film,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Compass,
  ArrowRight,
  Zap,
  Wind,
  Flame,
  Bell,
  Clock,
  Layers,
  ChevronDown,
} from "lucide-react";
import { EpisodeProject, SceneItem, SoundEffectType } from "../types";
import { CANON_EPISODES, CHARACTERS } from "../data/iWonderShowCanon";
import { playSoundEffect } from "../utils/soundEffects";

interface EpisodeFactoryProps {
  currentEpisode: EpisodeProject;
  onUpdateEpisode: (updated: Partial<EpisodeProject>) => void;
  onSelectTemplate: (templateId: string) => void;
  onNavigateToAnimatic: () => void;
}

export const EpisodeFactory: React.FC<EpisodeFactoryProps> = ({
  currentEpisode,
  onUpdateEpisode,
  onSelectTemplate,
  onNavigateToAnimatic,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [customIdea, setCustomIdea] = useState("");
  const [customLesson, setCustomLesson] = useState("Aprender a escuchar y pensar antes de actuar");
  const [customSceneCount, setCustomSceneCount] = useState(6);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [loadingSceneAction, setLoadingSceneAction] = useState<{ sceneId: string; type: "image" | "audio" | "video" } | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePlaySfx = (sfx: SoundEffectType) => {
    playSoundEffect(sfx);
  };

  const handlePlaySceneAudio = (scene: SceneItem) => {
    if (!scene.audioWavUrl) return;
    setPlayingAudioId(scene.id);
    const audio = new Audio(scene.audioWavUrl);
    audio.play();
    audio.onended = () => setPlayingAudioId(null);
  };

  // Generate 3D Image for a Scene
  const handleGenerateSceneImage = async (scene: SceneItem) => {
    setLoadingSceneAction({ sceneId: scene.id, type: "image" });
    playSoundEffect("click");

    try {
      const res = await fetch("/api/scene/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: scene.fxFlowPrompt || scene.visualAction,
          aspectRatio: currentEpisode.aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const updatedScenes = currentEpisode.scenes.map((s) =>
          s.id === scene.id ? { ...s, imageUrl: data.imageUrl } : s
        );
        onUpdateEpisode({ scenes: updatedScenes });
        playSoundEffect("pop");
      } else {
        alert(data.error || "No se pudo generar la imagen.");
      }
    } catch (err: any) {
      alert("Error al conectar con el servidor: " + err.message);
    } finally {
      setLoadingSceneAction(null);
    }
  };

  // Generate Dual Voice TTS for a Scene
  const handleGenerateSceneAudio = async (scene: SceneItem) => {
    setLoadingSceneAction({ sceneId: scene.id, type: "audio" });
    playSoundEffect("click");

    try {
      const res = await fetch("/api/scene/generate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialogue: scene.dialogue,
        }),
      });

      const data = await res.json();
      if (data.audioUrl) {
        const updatedScenes = currentEpisode.scenes.map((s) =>
          s.id === scene.id ? { ...s, audioWavUrl: data.audioUrl } : s
        );
        onUpdateEpisode({ scenes: updatedScenes });
        playSoundEffect("chime");

        // Autoplay generated audio
        const audio = new Audio(data.audioUrl);
        audio.play();
      } else {
        alert(data.error || "No se pudo generar las voces.");
      }
    } catch (err: any) {
      alert("Error al sintetizar voces: " + err.message);
    } finally {
      setLoadingSceneAction(null);
    }
  };

  // Animate Scene Video with Omni Flash
  const handleGenerateSceneVideo = async (scene: SceneItem) => {
    setLoadingSceneAction({ sceneId: scene.id, type: "video" });
    playSoundEffect("whoosh");

    try {
      const res = await fetch("/api/scene/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${scene.visualAction}. Camera: ${scene.cameraAngle}`,
          imageBase64: scene.imageUrl || undefined,
          duration: "5s",
          aspectRatio: currentEpisode.aspectRatio,
          previousInteractionId: scene.interactionId,
        }),
      });

      const data = await res.json();
      if (data.videoUrl) {
        const updatedScenes = currentEpisode.scenes.map((s) =>
          s.id === scene.id ? { ...s, videoUrl: data.videoUrl, interactionId: data.interactionId } : s
        );
        onUpdateEpisode({ scenes: updatedScenes });
        playSoundEffect("chime");
      } else if (data.status === "in_progress") {
        alert("El video se está procesando en segundo plano.");
      } else {
        alert(data.error || "No se pudo generar el video animado.");
      }
    } catch (err: any) {
      alert("Error al animar video: " + err.message);
    } finally {
      setLoadingSceneAction(null);
    }
  };

  // Generate Full Script from AI
  const handleGenerateNewScript = async () => {
    if (!customIdea.trim()) return;
    setIsGeneratingScript(true);
    playSoundEffect("whoosh");

    try {
      const res = await fetch("/api/episode/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: customIdea,
          lesson: customLesson,
          sceneCount: customSceneCount,
          episodeNumber: currentEpisode.episodeNumber + 1,
        }),
      });

      const data = await res.json();
      if (data.success && data.episode) {
        const ep = data.episode;
        const formattedScenes: SceneItem[] = ep.scenes.map((s: any, idx: number) => ({
          id: `ai-scene-${Date.now()}-${idx}`,
          number: s.number || idx + 1,
          stage: s.stage || "Curiosidad",
          title: s.title || `Escena ${idx + 1}`,
          visualAction: s.visualAction,
          cameraAngle: s.cameraAngle || "Plano medio",
          dialogue: s.dialogue || [],
          sfx: s.sfx || "none",
          fxFlowPrompt: s.fxFlowPrompt || "",
          durationSeconds: s.durationSeconds || 4,
        }));

        onUpdateEpisode({
          title: ep.title,
          synopsis: ep.synopsis,
          lesson: ep.lesson,
          scenes: formattedScenes,
        });

        setIsGeneratorModalOpen(false);
        playSoundEffect("chime");
      } else {
        alert(data.error || "Error al generar el guion.");
      }
    } catch (err: any) {
      alert("Error de conexión: " + err.message);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case "Curiosidad":
        return "bg-sky-500/10 text-sky-400 border-sky-500/30";
      case "Investigación":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Caos":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Descubrimiento":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Risas":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Lección":
        return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getSfxIcon = (sfx: SoundEffectType) => {
    switch (sfx) {
      case "zap":
        return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case "whoosh":
        return <Wind className="w-3.5 h-3.5 text-sky-400" />;
      case "smoke":
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case "alarm":
        return <Bell className="w-3.5 h-3.5 text-rose-400" />;
      case "ticking":
        return <Clock className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Volume2 className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Episode Bar & Template Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
                EPISODIO #{currentEpisode.episodeNumber}
              </span>
              <span className="text-xs text-amber-400 font-medium">
                Lección: {currentEpisode.lesson}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {currentEpisode.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {currentEpisode.synopsis}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsGeneratorModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nuevo Guion IA</span>
            </button>

            <button
              onClick={onNavigateToAnimatic}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ver en Animatic</span>
            </button>
          </div>
        </div>

        {/* Templates Quick Bar */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Cargar Plantilla Oficial de la Hoja de Concepto:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CANON_EPISODES.map((ep) => (
              <button
                key={ep.id}
                onClick={() => onSelectTemplate(ep.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 hover:border-sky-500/40 hover:text-white text-slate-300 transition-all whitespace-nowrap flex items-center space-x-1.5"
              >
                <Clapperboard className="w-3 h-3 text-sky-400" />
                <span>{ep.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scenes Production Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Viñetas de Producción ({currentEpisode.scenes.length} Escenas)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Fórmula: Curiosidad → Investigación → Caos → Descubrimiento → Risas → Lección
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentEpisode.scenes.map((scene) => (
            <div
              key={scene.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-slate-700/80 transition-all"
            >
              {/* Scene Card Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center font-mono">
                    #{scene.number}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStageBadgeColor(scene.stage)}`}>
                    {scene.stage}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 truncate max-w-[180px]">
                    {scene.title}
                  </h4>
                </div>

                <div className="flex items-center space-x-2">
                  {scene.sfx !== "none" && (
                    <button
                      onClick={() => handlePlaySfx(scene.sfx)}
                      className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                      title={`Efecto de sonido: ${scene.sfx.toUpperCase()}`}
                    >
                      {getSfxIcon(scene.sfx)}
                      <span className="uppercase font-mono">{scene.sfx}</span>
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    {scene.durationSeconds}s
                  </span>
                </div>
              </div>

              {/* Visual Preview Area (Image / Video) */}
              <div className="relative aspect-video bg-slate-950 border-b border-slate-800 flex items-center justify-center overflow-hidden group">
                {scene.videoUrl ? (
                  <video
                    src={scene.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : scene.imageUrl ? (
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <Clapperboard className="w-6 h-6 text-sky-400/60" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium px-4 line-clamp-2">
                      {scene.visualAction}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {scene.cameraAngle}
                    </span>
                  </div>
                )}

                {/* Overlaid quick actions */}
                <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-90">
                  {scene.audioWavUrl && (
                    <button
                      onClick={() => handlePlaySceneAudio(scene)}
                      className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-sky-400 shadow-md border border-slate-700"
                      title="Reproducir Voces Sintetizadas"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === scene.id ? "text-amber-400 animate-pulse" : ""}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Dialogue Bubbles */}
              <div className="p-4 space-y-2.5 flex-1 bg-slate-900">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Diálogos en Español (Saúl & César):
                </span>
                <div className="space-y-1.5">
                  {scene.dialogue.map((d, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
                        d.speaker === "Saul"
                          ? "bg-slate-950 border-sky-500/20 text-sky-100"
                          : d.speaker === "Cesar"
                          ? "bg-slate-950 border-amber-500/20 text-amber-100"
                          : "bg-slate-950 border-slate-800 text-slate-300"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                          d.speaker === "Saul"
                            ? "bg-sky-600 text-white"
                            : d.speaker === "Cesar"
                            ? "bg-amber-500 text-slate-950 font-extrabold"
                            : "bg-slate-700 text-white"
                        }`}
                      >
                        {d.speaker === "Saul" ? "S" : d.speaker === "Cesar" ? "C" : "N"}
                      </span>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[11px] text-white">
                            {d.speaker === "Saul" ? "Saúl" : d.speaker === "Cesar" ? "César" : "Narrador"}
                          </span>
                          {d.emotion && (
                            <span className="text-[10px] text-slate-400 italic">
                              ({d.emotion})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-200 leading-snug">{d.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FX Flow Prompt Box */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-400">Prompt Google FX Flow:</span>
                  <button
                    onClick={() => copyToClipboard(scene.fxFlowPrompt, `prompt-${scene.id}`)}
                    className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                  >
                    {copiedId === `prompt-${scene.id}` ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>Copiar Prompt</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] text-slate-400 line-clamp-2 bg-slate-900/60 p-1.5 rounded border border-slate-800/80">
                  {scene.fxFlowPrompt}
                </p>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleGenerateSceneImage(scene)}
                  disabled={loadingSceneAction?.sceneId === scene.id}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 transition-all flex items-center justify-center space-x-1"
                >
                  <Sparkles className={`w-3 h-3 ${loadingSceneAction?.sceneId === scene.id && loadingSceneAction.type === "image" ? "animate-spin text-amber-400" : ""}`} />
                  <span>{loadingSceneAction?.sceneId === scene.id && loadingSceneAction.type === "image" ? "Dibujando..." : "Cuadro 3D"}</span>
                </button>

                <button
                  onClick={() => handleGenerateSceneAudio(scene)}
                  disabled={loadingSceneAction?.sceneId === scene.id}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex items-center justify-center space-x-1"
                >
                  <Volume2 className={`w-3 h-3 ${loadingSceneAction?.sceneId === scene.id && loadingSceneAction.type === "audio" ? "animate-pulse text-amber-400" : ""}`} />
                  <span>{loadingSceneAction?.sceneId === scene.id && loadingSceneAction.type === "audio" ? "Voces..." : "Voces Duales"}</span>
                </button>

                <button
                  onClick={() => handleGenerateSceneVideo(scene)}
                  disabled={loadingSceneAction?.sceneId === scene.id}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all flex items-center justify-center space-x-1"
                >
                  <Film className={`w-3 h-3 ${loadingSceneAction?.sceneId === scene.id && loadingSceneAction.type === "video" ? "animate-spin text-purple-400" : ""}`} />
                  <span>{loadingSceneAction?.sceneId === scene.id && loadingSceneAction.type === "video" ? "Animando..." : "Animar Video"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Episode Generator Modal */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Generador de Guion y Escenas IA para I Wonder Show
                </h3>
              </div>
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Idea central del episodio:
                </label>
                <textarea
                  value={customIdea}
                  onChange={(e) => setCustomIdea(e.target.value)}
                  placeholder="Ej: Saúl y César construyen una máquina de panqueques supersónica en el taller, pero César le pone combustible de cohete..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Lección moral detrás de la comedia:
                </label>
                <input
                  type="text"
                  value={customLesson}
                  onChange={(e) => setCustomLesson(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">
                    Número de viñetas:
                  </label>
                  <select
                    value={customSceneCount}
                    onChange={(e) => setCustomSceneCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100"
                  >
                    <option value={4}>4 Viñetas (Micro corto)</option>
                    <option value={6}>6 Viñetas (Fórmula estándar)</option>
                    <option value={8}>8 Viñetas (Episodio completo como Unplug First)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-200 block mb-1">
                    Formato de Video:
                  </label>
                  <select
                    value={currentEpisode.aspectRatio}
                    onChange={(e) => onUpdateEpisode({ aspectRatio: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100"
                  >
                    <option value="16:9">16:9 Panorámico (YouTube/TV)</option>
                    <option value="9:16">9:16 Vertical (Shorts/TikTok/Reels)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateNewScript}
                disabled={isGeneratingScript || !customIdea.trim()}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingScript ? "animate-spin text-amber-300" : ""}`} />
                <span>{isGeneratingScript ? "Escribiendo Guion con Gemini..." : "Generar Episodio"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
