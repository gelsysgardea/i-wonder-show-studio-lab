import React from "react";
import { Clapperboard, BookOpen, Film, Search, Download, HelpCircle, Sparkles } from "lucide-react";

export type StudioTab = "factory" | "bible" | "animatic" | "analyzer" | "export";

interface HeaderProps {
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  onOpenDownloadModal: () => void;
  onOpenGuideModal: () => void;
  sceneCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDownloadModal,
  onOpenGuideModal,
  sceneCount,
}) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-amber-400 flex items-center justify-center text-white font-extrabold shadow-md shadow-sky-500/20 text-sm tracking-tighter">
              IW
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-100 tracking-tight whitespace-nowrap">
                  I Wonder Show <span className="text-sky-400 font-extrabold">Studio Lab</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20 whitespace-nowrap">
                  Saúl & César
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Fábrica de Episodios Animados 3D · Curiosidad Sin Límites
              </p>
            </div>
          </div>

          {/* Zone 2: 5 clean single-line nav links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 shrink-0">
            <button
              onClick={() => setActiveTab("factory")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === "factory"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5 text-sky-400" />
              <span>Fábrica de Episodios ({sceneCount})</span>
            </button>

            <button
              onClick={() => setActiveTab("bible")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === "bible"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Biblia & Personajes</span>
            </button>

            <button
              onClick={() => setActiveTab("animatic")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === "animatic"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>Teatro Animatic</span>
            </button>

            <button
              onClick={() => setActiveTab("analyzer")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === "analyzer"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Search className="w-3.5 h-3.5 text-purple-400" />
              <span>Analizador de Referencias</span>
            </button>

            <button
              onClick={() => setActiveTab("export")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === "export"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar Paquete & Python</span>
            </button>
          </nav>

          {/* Zone 3: Primary action + help trigger */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenGuideModal}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all whitespace-nowrap shrink-0"
              title="Guía de Claves y Variables"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Claves API</span>
            </button>

            <button
              onClick={onOpenDownloadModal}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-md shadow-sky-500/15 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Exportar Episodio</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setActiveTab("factory")}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === "factory" ? "bg-sky-600 text-white" : "text-slate-400"
            }`}
          >
            Fábrica ({sceneCount})
          </button>
          <button
            onClick={() => setActiveTab("bible")}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === "bible" ? "bg-sky-600 text-white" : "text-slate-400"
            }`}
          >
            Biblia
          </button>
          <button
            onClick={() => setActiveTab("animatic")}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === "animatic" ? "bg-sky-600 text-white" : "text-slate-400"
            }`}
          >
            Teatro Animatic
          </button>
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === "analyzer" ? "bg-sky-600 text-white" : "text-slate-400"
            }`}
          >
            Analizador
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
              activeTab === "export" ? "bg-sky-600 text-white" : "text-slate-400"
            }`}
          >
            Exportar
          </button>
        </div>
      </div>
    </header>
  );
};
