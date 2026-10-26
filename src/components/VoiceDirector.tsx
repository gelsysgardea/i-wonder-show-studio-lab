import React, { useState } from "react";
import {
  Mic,
  Sliders,
  Volume2,
  Sparkles,
  Zap,
  Wind,
  Flame,
  Bell,
  Clock,
  RotateCcw,
  Check,
  Play,
  X,
  VolumeX,
  Radio,
  Layers,
} from "lucide-react";
import { SceneItem, SoundEffectType, ShowSpeaker } from "../types";
import { playSoundEffect } from "../utils/soundEffects";

interface VoiceDirectorProps {
  scene: SceneItem;
  onUpdateScene: (updated: Partial<SceneItem>) => void;
  onClose: () => void;
}

export const VoiceDirector: React.FC<VoiceDirectorProps> = ({
  scene,
  onUpdateScene,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"saul" | "cesar" | "sfx">("saul");

  // Saúl Voice Parameters
  const [saulVoice, setSaulVoice] = useState<string>("Charon");
  const [saulPitch, setSaulPitch] = useState<number>(0); // -6 to +6
  const [saulSpeed, setSaulSpeed] = useState<number>(1.0); // 0.75x to 1.35x
  const [saulStyle, setSaulStyle] = useState<string>(
    "Calm, grounded, slightly sarcastic and instructional"
  );

  // César Voice Parameters
  const [cesarVoice, setCesarVoice] = useState<string>("Puck");
  const [cesarPitch, setCesarPitch] = useState<number>(2); // slightly higher
  const [cesarSpeed, setCesarSpeed] = useState<number>(1.05);
  const [cesarStyle, setCesarStyle] = useState<string>(
    "Excited, animated, energetic, curious and breathless"
  );

  // Editable Dialogues
  const [dialogueList, setDialogueList] = useState(scene.dialogue);

  // Loading States
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlayingTestLine, setIsPlayingTestLine] = useState<string | null>(null);

  const saulStylePresets = [
    {
      label: "Calmado & Sarcástico",
      desc: "Tono paciente pero mordaz ('Esto es exactamente por lo que se desconecta...')",
      val: "Calm, grounded, slightly sarcastic and instructional",
    },
    {
      label: "Advertencia Firme",
      desc: "Alerta directa ('¡Espera César! ¡Todavía está conectada!')",
      val: "Stern, serious warning, urgent and protective friend",
    },
    {
      label: "Cómplice & Curioso",
      desc: "Uniéndose a la travesura con una sonrisa",
      val: "Amused, partner in crime, curious but watchful",
    },
    {
      label: "Decepción Cómica",
      desc: "Reacción de facepalm tras la explosión",
      val: "Deadpan, exhausted disbelief, slow headshake comedy",
    },
  ];

  const cesarStylePresets = [
    {
      label: "Fascinado (I Wonder...?)",
      desc: "Susurro obsesionado antes de meter la mano",
      val: "Excited, animated, energetic, curious, breathless fascination",
    },
    {
      label: "Exaltado / Hiperactivo",
      desc: "¡Órale Saúl! ¡Vamos a arreglar esta tele!",
      val: "High-octane energetic, fast-talking enthusiasm, laughing with excitement",
    },
    {
      label: "Electrificado / Aturdido",
      desc: "Ssssss... tosiendo con humo y lengua trabada",
      val: "Dazed, shocked, slurred speech, cartoon electrocuted dazed murmur",
    },
    {
      label: "Pánico Cómico",
      desc: "Grito desaforado cuando todo empieza a pegarse",
      val: "Frantic, high-pitched comedic panic, shouting in distress",
    },
  ];

  const sfxPadItems: { type: SoundEffectType; label: string; icon: any; color: string }[] = [
    { type: "zap", label: "¡ZZZAAPPPP!", icon: Zap, color: "hover:border-yellow-400 text-yellow-300" },
    { type: "whoosh", label: "¡WHOOSH!", icon: Wind, color: "hover:border-sky-400 text-sky-300" },
    { type: "pop", label: "¡POP!", icon: Play, color: "hover:border-rose-400 text-rose-300" },
    { type: "click", label: "¡CLICK!", icon: Sliders, color: "hover:border-emerald-400 text-emerald-300" },
    { type: "smoke", label: "¡SSSSSS!", icon: Flame, color: "hover:border-orange-400 text-orange-300" },
    { type: "chime", label: "¡CHIME!", icon: Sparkles, color: "hover:border-amber-300 text-amber-200" },
    { type: "explosion", label: "¡BOOM!", icon: Flame, color: "hover:border-red-500 text-red-400" },
    { type: "alarm", label: "¡ALARMA!", icon: Bell, color: "hover:border-purple-400 text-purple-300" },
    { type: "ticking", label: "¡TIC-TAC!", icon: Clock, color: "hover:border-blue-400 text-blue-300" },
  ];

  // Play test line for a single speaker
  const handleTestLine = async (speaker: ShowSpeaker, text: string) => {
    setIsPlayingTestLine(speaker);
    playSoundEffect("click");

    try {
      const voice = speaker === "Saul" ? saulVoice : cesarVoice;
      const style = speaker === "Saul" ? saulStyle : cesarStyle;

      const res = await fetch("/api/scene/generate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialogue: [{ speaker, text, speechStyle: style }],
          saulVoice: voice,
          cesarVoice: voice,
        }),
      });

      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.playbackRate = speaker === "Saul" ? saulSpeed : cesarSpeed;
        audio.play();
        audio.onended = () => setIsPlayingTestLine(null);
      } else {
        setIsPlayingTestLine(null);
      }
    } catch (err) {
      console.warn("Test line error:", err);
      setIsPlayingTestLine(null);
    }
  };

  // Synthesize Full Scene Audio with Gemini TTS
  const handleSynthesizeFullScene = async () => {
    setIsSynthesizing(true);
    playSoundEffect("whoosh");

    try {
      const res = await fetch("/api/scene/generate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialogue: dialogueList,
          saulVoice,
          cesarVoice,
          saulStyle,
          cesarStyle,
        }),
      });

      const data = await res.json();
      if (data.audioUrl) {
        onUpdateScene({
          dialogue: dialogueList,
          audioWavUrl: data.audioUrl,
        });

        playSoundEffect("chime");
        const audio = new Audio(data.audioUrl);
        audio.play();
      } else {
        alert(data.error || "No se pudo sintetizar el audio de la escena.");
      }
    } catch (err: any) {
      alert("Error en la síntesis de voz: " + err.message);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleUpdateDialogueText = (index: number, newText: string) => {
    const updated = [...dialogueList];
    updated[index].text = newText;
    setDialogueList(updated);
    onUpdateScene({ dialogue: updated });
  };

  const handleSelectSfx = (sfx: SoundEffectType) => {
    playSoundEffect(sfx);
    onUpdateScene({ sfx });
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full h-full max-h-[85vh]">
      {/* Console Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                VoiceDirector Console
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                Escena #{scene.number}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
              {scene.title} · {scene.stage}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cerrar VoiceDirector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 p-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("saul")}
          className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === "saul"
              ? "bg-sky-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-300" />
          <span>Saúl</span>
        </button>

        <button
          onClick={() => setActiveTab("cesar")}
          className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === "cesar"
              ? "bg-amber-500 text-slate-950 font-extrabold shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>César</span>
        </button>

        <button
          onClick={() => setActiveTab("sfx")}
          className={`py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === "sfx"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Zap className="w-3 h-3 text-yellow-300" />
          <span>SFX Pad</span>
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300 flex-1">
        {/* TAB 1: SAÚL CONTROLS */}
        {activeTab === "saul" && (
          <div className="space-y-4">
            {/* Voice Model Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Voz Gemini Asignada</span>
                <span className="text-[10px] text-sky-400 font-mono">Charon (Canónica)</span>
              </label>
              <select
                value={saulVoice}
                onChange={(e) => setSaulVoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-sky-500 focus:outline-none"
              >
                <option value="Charon">Charon (Grave serena, ligeramente irónica - Canónica)</option>
                <option value="Fenrir">Fenrir (Grave profunda y firme)</option>
                <option value="Zephyr">Zephyr (Equilibrada, neutral)</option>
                <option value="Puck">Puck (Juvenil enérgica)</option>
              </select>
            </div>

            {/* Faders: Pitch & Speed */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Tono / Pitch ({saulPitch > 0 ? `+${saulPitch}` : saulPitch} semitonos)</span>
                  <button
                    onClick={() => setSaulPitch(0)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Reset
                  </button>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={saulPitch}
                  onChange={(e) => setSaulPitch(Number(e.target.value))}
                  className="w-full accent-sky-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Velocidad de Articulación ({saulSpeed}x)</span>
                  <button
                    onClick={() => setSaulSpeed(1.0)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    1.0x
                  </button>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={saulSpeed}
                  onChange={(e) => setSaulSpeed(Number(e.target.value))}
                  className="w-full accent-sky-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Acting Style Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Estilo de Actuación Interpretativa:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {saulStylePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSaulStyle(preset.val)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      saulStyle === preset.val
                        ? "bg-sky-500/10 border-sky-500 text-sky-200 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-bold text-xs block text-slate-200">{preset.label}</span>
                    <span className="text-[10px] text-slate-400 block">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lines in this scene */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Líneas de Saúl en esta Viñeta:
              </span>
              {dialogueList
                .map((d, index) => ({ d, index }))
                .filter(({ d }) => d.speaker === "Saul")
                .map(({ d, index }) => (
                  <div key={index} className="space-y-1.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-sky-400 font-bold">Saúl</span>
                      <button
                        onClick={() => handleTestLine("Saul", d.text)}
                        disabled={isPlayingTestLine === "Saul"}
                        className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isPlayingTestLine === "Saul" ? "Probando..." : "Probar Línea"}</span>
                      </button>
                    </div>
                    <textarea
                      value={d.text}
                      onChange={(e) => handleUpdateDialogueText(index, e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: CÉSAR CONTROLS */}
        {activeTab === "cesar" && (
          <div className="space-y-4">
            {/* Voice Model Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Voz Gemini Asignada</span>
                <span className="text-[10px] text-amber-400 font-mono">Puck (Canónica)</span>
              </label>
              <select
                value={cesarVoice}
                onChange={(e) => setCesarVoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-mono focus:border-amber-500 focus:outline-none"
              >
                <option value="Puck">Puck (Juvenil, rápida, expresiva - Canónica)</option>
                <option value="Kore">Kore (Vibrante, melódica)</option>
                <option value="Zephyr">Zephyr (Equilibrada, limpia)</option>
                <option value="Fenrir">Fenrir (Grave potente)</option>
              </select>
            </div>

            {/* Faders: Pitch & Speed */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Tono / Pitch ({cesarPitch > 0 ? `+${cesarPitch}` : cesarPitch} semitonos)</span>
                  <button
                    onClick={() => setCesarPitch(0)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Reset
                  </button>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={cesarPitch}
                  onChange={(e) => setCesarPitch(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Velocidad de Articulación ({cesarSpeed}x)</span>
                  <button
                    onClick={() => setCesarSpeed(1.0)}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    1.0x
                  </button>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.45"
                  step="0.05"
                  value={cesarSpeed}
                  onChange={(e) => setCesarSpeed(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Acting Style Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Estilo de Actuación Interpretativa:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {cesarStylePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCesarStyle(preset.val)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      cesarStyle === preset.val
                        ? "bg-amber-500/10 border-amber-500 text-amber-200 shadow-sm"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-bold text-xs block text-slate-200">{preset.label}</span>
                    <span className="text-[10px] text-slate-400 block">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lines in this scene */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Líneas de César en esta Viñeta:
              </span>
              {dialogueList
                .map((d, index) => ({ d, index }))
                .filter(({ d }) => d.speaker === "Cesar")
                .map(({ d, index }) => (
                  <div key={index} className="space-y-1.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-bold">César</span>
                      <button
                        onClick={() => handleTestLine("Cesar", d.text)}
                        disabled={isPlayingTestLine === "Cesar"}
                        className="text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isPlayingTestLine === "Cesar" ? "Probando..." : "Probar Línea"}</span>
                      </button>
                    </div>
                    <textarea
                      value={d.text}
                      onChange={(e) => handleUpdateDialogueText(index, e.target.value)}
                      rows={2}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: SFX MASTER PAD */}
        {activeTab === "sfx" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300">
                Efecto Asignado a la Viñeta:
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {scene.sfx.toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Pad de Efectos Cómicos (Haz clic para probar y asignar):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sfxPadItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = scene.sfx === item.type;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectSfx(item.type)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 active:scale-95 ${
                        isSelected
                          ? "bg-amber-400/20 border-amber-400 text-white shadow-md shadow-amber-400/10 scale-[1.02]"
                          : "bg-slate-950 border-slate-800 hover:bg-slate-900 " + item.color
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-extrabold text-[10px] block truncate">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1 leading-relaxed">
              <span className="font-semibold text-slate-200 block">Sincronización Automática:</span>
              <p>
                Al reproducir el episodio en el Teatro Animatic, el efecto se disparará en el momento exacto en que ocurra el gag de la viñeta (ej. la descarga eléctrica de 220V al meter el destornillador).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Console Bottom Action Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            playSoundEffect(scene.sfx);
            if (scene.audioWavUrl) {
              const a = new Audio(scene.audioWavUrl);
              a.play();
            }
          }}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
          title="Escuchar audio actual y efecto de sonido"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Probar Mezcla</span>
        </button>

        <button
          onClick={handleSynthesizeFullScene}
          disabled={isSynthesizing}
          className="flex-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-md shadow-sky-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? "animate-spin text-amber-300" : ""}`} />
          <span>{isSynthesizing ? "Sintetizando Voces con Gemini..." : "Sintetizar Audio de Escena"}</span>
        </button>
      </div>
    </div>
  );
};
