import React, { useState } from "react";
import { BookOpen, Copy, Check, Volume2, Sparkles, ZoomIn, X, Users, Compass, Film, ExternalLink } from "lucide-react";
import { CHARACTERS, SHOW_ASSETS } from "../data/iWonderShowCanon";
import { playSoundEffect } from "../utils/soundEffects";

export const CharacterBible: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestVoice = async (speaker: "saul" | "cesar") => {
    setIsPlayingAudio(speaker);
    playSoundEffect(speaker === "saul" ? "click" : "pop");

    try {
      const dialogue =
        speaker === "saul"
          ? [{ speaker: "Saul", text: "¡Tranquilo César! Lo primero es desconectarla, antes de que vueles por los aires.", emotion: "Calmado" }]
          : [{ speaker: "Cesar", text: "¡Órale Saúl! ¡Mira lo que encontré! I WONDER qué pasa si presiono este botón...", emotion: "Emocionado" }];

      const res = await fetch("/api/scene/generate-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dialogue }),
      });

      const data = await res.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
        audio.onended = () => setIsPlayingAudio(null);
      } else {
        setIsPlayingAudio(null);
      }
    } catch (err) {
      console.warn("TTS test error:", err);
      setIsPlayingAudio(null);
    }
  };

  const galleryItems = [
    {
      src: SHOW_ASSETS.POSTER_ART,
      title: "Póster Oficial Noche de Luna",
      subtitle: "Saúl & César sentados de espaldas bajo la luna llena cósmica. Arte clave 3D.",
    },
    {
      src: SHOW_ASSETS.CONCEPT_BIBLE,
      title: "Biblia de Concepto & Universo",
      subtitle: "Hoja de modelo canónica, fórmula de comedia y los 7 episodios iniciales.",
    },
    {
      src: SHOW_ASSETS.COMIC_UNPLUG_FIRST,
      title: "Storyboard: ¡Desconecta Primero!",
      subtitle: "El episodio piloto de 8 viñetas completas con la descarga de 220 voltios.",
    },
    {
      src: SHOW_ASSETS.COMIC_ADHESIVE_EXPERIMENT,
      title: "Storyboard: El Día Que Todo Se Pegó",
      subtitle: "El experimento del adhesivo al 100% y el congelamiento del pueblo.",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950 border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Biblia Oficial de Producción · I Wonder Show</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Universo Canónico de <span className="text-sky-400">Saúl & César</span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Conserva la consistencia visual y narrativa exacta en cada cuadro. Aquí residen las 4 láminas originales de tu amigo, los perfiles de ADN para Google FX Flow y el principio rector que guía cada aventura.
          </p>
        </div>
      </div>

      {/* Section 1: The Core Principle & Formula */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-sky-400" />
          <span>Fórmula Inquebrantable de Cada Episodio</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
          {[
            { step: "1. Curiosidad", desc: "Un objeto o misterio cotidiano", color: "border-sky-500/30 text-sky-400 bg-sky-950/20" },
            { step: "2. Investigación", desc: "Intentar descubrir qué hace", color: "border-blue-500/30 text-blue-400 bg-blue-950/20" },
            { step: "3. Caos", desc: "El botón o paso que sale mal", color: "border-amber-500/30 text-amber-400 bg-amber-950/20" },
            { step: "4. Descubrimiento", desc: "La explicación física/científica", color: "border-emerald-500/30 text-emerald-400 bg-emerald-950/20" },
            { step: "5. Risas", desc: "Consecuencias cómicas visuales", color: "border-rose-500/30 text-rose-400 bg-rose-950/20" },
            { step: "6. I Wonder", desc: "La gran lección y pregunta", color: "border-yellow-500/30 text-yellow-300 bg-yellow-950/20" },
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${item.color} space-y-1 text-center`}>
              <span className="font-bold text-xs block">{item.step}</span>
              <span className="text-[11px] text-slate-400 block leading-tight">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Character Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SAÚL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-lg text-slate-100 shadow-inner">
                S
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{CHARACTERS.saul.name}</h3>
                <span className="text-xs text-sky-400 font-medium">{CHARACTERS.saul.title}</span>
              </div>
            </div>

            <button
              onClick={() => handleTestVoice("saul")}
              disabled={isPlayingAudio === "saul"}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio === "saul" ? "animate-spin text-amber-400" : ""}`} />
              <span>{isPlayingAudio === "saul" ? "Hablando..." : "Probar Voz"}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Rasgos Visuales Clave (ADN)
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {CHARACTERS.saul.visualTraits.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Personalidad & Dinámica
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {CHARACTERS.saul.personality.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-amber-400 uppercase font-mono block mb-1">Frase Icónica</span>
              <p className="italic text-slate-200">"{CHARACTERS.saul.quote}"</p>
            </div>

            {/* Prompt DNA for Copy */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Prompt DNA (Para FX Flow / Gemini):</span>
                <button
                  onClick={() => copyToClipboard(CHARACTERS.saul.promptDNA, "saul-dna")}
                  className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                >
                  {copiedKey === "saul-dna" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar Prompt DNA</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 line-clamp-3">
                {CHARACTERS.saul.promptDNA}
              </div>
            </div>
          </div>
        </div>

        {/* CÉSAR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-lg text-amber-300 shadow-inner">
                C
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{CHARACTERS.cesar.name}</h3>
                <span className="text-xs text-amber-400 font-medium">{CHARACTERS.cesar.title}</span>
              </div>
            </div>

            <button
              onClick={() => handleTestVoice("cesar")}
              disabled={isPlayingAudio === "cesar"}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio === "cesar" ? "animate-spin text-amber-400" : ""}`} />
              <span>{isPlayingAudio === "cesar" ? "Hablando..." : "Probar Voz"}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Rasgos Visuales Clave (ADN)
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {CHARACTERS.cesar.visualTraits.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Personalidad & Dinámica
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {CHARACTERS.cesar.personality.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-amber-400 uppercase font-mono block mb-1">Frase Icónica</span>
              <p className="italic text-slate-200">"{CHARACTERS.cesar.quote}"</p>
            </div>

            {/* Prompt DNA for Copy */}
            <div className="space-y-1 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Prompt DNA (Para FX Flow / Gemini):</span>
                <button
                  onClick={() => copyToClipboard(CHARACTERS.cesar.promptDNA, "cesar-dna")}
                  className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  {copiedKey === "cesar-dna" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copiar Prompt DNA</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 line-clamp-3">
                {CHARACTERS.cesar.promptDNA}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Original Artwork Gallery & Lightbox */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Láminas y Cómics Originales Cargados
            </h3>
          </div>
          <span className="text-xs text-slate-400">Haz clic en cualquier lámina para verla en pantalla completa</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition-all hover:scale-[1.02] shadow-md flex flex-col"
            >
              <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg">
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ampliar</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/70">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedImage.title}</h3>
                <p className="text-xs text-slate-400">{selectedImage.subtitle}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-black/60 max-h-[80vh]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
              <span>Referencia oficial cargada en el proyecto</span>
              <a
                href={selectedImage.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline flex items-center space-x-1"
              >
                <span>Abrir archivo en pestaña nueva</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
