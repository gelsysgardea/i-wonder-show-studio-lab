import React, { useState, useMemo } from "react";
import { Header, StudioTab } from "./components/Header";
import { EpisodeFactory } from "./components/EpisodeFactory";
import { CharacterBible } from "./components/CharacterBible";
import { AnimaticTheater } from "./components/AnimaticTheater";
import { ImageSearchAnalyzer } from "./components/ImageSearchAnalyzer";
import { ExportAndPython } from "./components/ExportAndPython";
import { DownloadModal } from "./components/DownloadModal";
import { CredentialsGuideModal } from "./components/CredentialsGuideModal";
import { CANON_EPISODES } from "./data/iWonderShowCanon";
import { generateBundleFiles } from "./data/bundleTemplates";
import { BundleConfig, EpisodeProject, SceneItem } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<StudioTab>("factory");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Initialize with Canon Episode 1: "¡Desconecta Primero!"
  const initialCanon = CANON_EPISODES[0];
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeProject>({
    id: initialCanon.id,
    title: initialCanon.title,
    episodeNumber: initialCanon.episodeNumber,
    synopsis: initialCanon.synopsis,
    lesson: initialCanon.lesson,
    corePrinciple: "Curiosity → Investigation → Chaos → Discovery → Laugh → I Wonder Show",
    createdAt: new Date().toISOString(),
    aspectRatio: "16:9",
    scenes: initialCanon.scenes.map((s, idx) => ({
      ...s,
      id: `canon-scene-${idx + 1}`,
    })),
  });

  // Default Python bundle configuration for export
  const [config, setConfig] = useState<BundleConfig>({
    projectName: "i-wonder-show-pipeline",
    version: "1.0.0",
    author: "I Wonder Show Creators",
    description: "Script ejecutable Python modular para la serie animada de Saúl y César con JWT, cifrado y optimización de tokens",
    pythonVersion: "3.11",
    jwtSecret: "super-secret-i-wonder-show-jwt-token",
    jwtExpirationMinutes: 60,
    encryptionKey: "c29tZV9zZWNyZXRfYmFzZTY0X2tleV9mb3JfZmVybmV0X2Flc19jcnlwdG8=",
    geminiModel: "gemini-3.8-flash",
    logLevel: "INFO",
    tokenBudgetMax: 8192,
    enableTokenOptimization: true,
    enableDocker: true,
    enableKubernetes: true,
    k8sNamespace: "wonder-show-system",
    k8sReplicas: 2,
    port: 3000,
    customEnvVars: [
      {
        key: "SERIE_TITULO",
        value: "I Wonder Show - Curiosidad Sin Limites",
        comment: "Nombre canónico de la serie animada",
      },
      {
        key: "MODO_PRODUCCION",
        value: "studio_lab_active",
        comment: "Entorno de generación de episodios",
      },
    ],
  });

  // Switch template
  const handleSelectTemplate = (templateId: string) => {
    const template = CANON_EPISODES.find((ep) => ep.id === templateId);
    if (!template) return;

    setCurrentEpisode({
      id: template.id,
      title: template.title,
      episodeNumber: template.episodeNumber,
      synopsis: template.synopsis,
      lesson: template.lesson,
      corePrinciple: "Curiosity → Investigation → Chaos → Discovery → Laugh → I Wonder Show",
      createdAt: new Date().toISOString(),
      aspectRatio: currentEpisode.aspectRatio,
      scenes: template.scenes.map((s, idx) => ({
        ...s,
        id: `template-scene-${Date.now()}-${idx + 1}`,
      })),
    });
  };

  const handleUpdateEpisode = (updated: Partial<EpisodeProject>) => {
    setCurrentEpisode((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateConfig = (updated: Partial<BundleConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  // Generate all files dynamically based on config for ZIP modal
  const generatedFiles = useMemo(() => {
    return generateBundleFiles(config);
  }, [config]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        sceneCount={currentEpisode.scenes.length}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "factory" && (
          <EpisodeFactory
            currentEpisode={currentEpisode}
            onUpdateEpisode={handleUpdateEpisode}
            onSelectTemplate={handleSelectTemplate}
            onNavigateToAnimatic={() => setActiveTab("animatic")}
          />
        )}

        {activeTab === "bible" && <CharacterBible />}

        {activeTab === "animatic" && (
          <AnimaticTheater
            episode={currentEpisode}
            onNavigateToFactory={() => setActiveTab("factory")}
          />
        )}

        {activeTab === "analyzer" && <ImageSearchAnalyzer config={config} />}

        {activeTab === "export" && <ExportAndPython episode={currentEpisode} />}
      </main>

      {/* Subtle Studio Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">I Wonder Show — IA Studio Lab</span>
            <span>·</span>
            <span>Curiosidad Sin Límites &copy; 2026</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab("bible")}
              className="hover:text-sky-400 transition-colors"
            >
              Biblia de Saúl & César
            </button>
            <button
              onClick={() => setActiveTab("animatic")}
              className="hover:text-sky-400 transition-colors"
            >
              Teatro Animatic
            </button>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="text-sky-400 font-semibold hover:underline"
            >
              Descargar Paquete ZIP
            </button>
          </div>
        </div>
      </footer>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        config={config}
        files={generatedFiles}
      />

      {/* Credentials Guide Modal */}
      <CredentialsGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
      />
    </div>
  );
}
