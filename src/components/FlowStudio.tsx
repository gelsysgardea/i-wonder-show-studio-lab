import React, { useState } from "react";
import { Sparkles, Zap, Shield, Key, Lock, ArrowRight, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { BundleConfig, TokenMetrics } from "../types";

interface FlowStudioProps {
  config: BundleConfig;
  onUpdateConfig: (updated: Partial<BundleConfig>) => void;
}

export const FlowStudio: React.FC<FlowStudioProps> = ({ config, onUpdateConfig }) => {
  const [promptInput, setPromptInput] = useState(
    "Generar un flujo de renderizado cinematográfico con efectos de partículas luminosas, Iluminación volumétrica y sonido espacial."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationOutput, setGenerationOutput] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<TokenMetrics | null>({
    inputTokens: 142,
    outputTokens: 520,
    totalTokens: 662,
    efficiencyScore: 88,
    estimatedCreditsSavedPercentage: "32%",
    costUSD: "0.000198",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunFlowTest = async (mode: "enhance" | "optimize_tokens" | "generate_python") => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/flow/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput,
          model: config.geminiModel,
          mode,
          maxOutputTokens: config.tokenBudgetMax,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la solicitud");
      }

      setGenerationOutput(data.output);
      if (data.metrics) {
        setMetrics({
          inputTokens: data.metrics.inputTokens,
          outputTokens: data.metrics.outputTokens,
          totalTokens: data.metrics.totalTokens,
          efficiencyScore: data.metrics.tokenEfficiencyScore,
          estimatedCreditsSavedPercentage: data.metrics.estimatedCreditsSavedPercentage,
          costUSD: (data.metrics.totalTokens * 0.0000003).toFixed(6),
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Fallo en la comunicación con la API");
    } finally {
      setIsGenerating(false);
    }
  };

  const presetPrompts = [
    "Generar render FX 3D hiperrealista con partículas de fuego futurista",
    "Pipeline audiovisual reactivo con sintetizador de voz e imagen generativa",
    "Sistema de procesamiento de audio en tiempo real con cifrado AES-256 en reposo",
    "Simulador de animación de física cuántica para VFX de película con Gemini 3.6",
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Google FX Tool Reference */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Google FX Flow Studio & Maximizador de Tokens</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Generador de Flujos e Integrador de Script Ejecutable
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Basado en el entorno de herramientas compartidas de Google FX Labs. Configura tu flujo de trabajo de Inteligencia Artificial, optimiza el consumo de crédito/tokens y descarga el paquete listo para tu laptop.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <span className="block text-slate-400 font-mono text-[10px]">Modelo Activo:</span>
              <span className="font-semibold text-cyan-300">{config.geminiModel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prompt Editor & Config Fast Actions */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Prompt Base para el Pipeline de FX Flow</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {promptInput.length} caracteres (~{Math.ceil(promptInput.length / 3.8)} tokens)
              </span>
            </div>

            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              placeholder="Ingresa tu prompt creativo para probar el generador y medir el consumo de créditos..."
            />

            {/* Presets */}
            <div className="mt-3">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Prompts Predefinidos de Prueba Google FX:
              </span>
              <div className="flex flex-wrap gap-2">
                {presetPrompts.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPromptInput(preset)}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-all text-left truncate max-w-xs"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => handleRunFlowTest("enhance")}
                disabled={isGenerating || !promptInput}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generar Flujo FX</span>
              </button>

              <button
                onClick={() => handleRunFlowTest("optimize_tokens")}
                disabled={isGenerating || !promptInput}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700/80 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Maximizar Créditos / Tokens</span>
              </button>

              <button
                onClick={() => handleRunFlowTest("generate_python")}
                disabled={isGenerating || !promptInput}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Generar Módulo Python</span>
              </button>
            </div>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block mb-1">Error de procesamiento:</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Generation Output Display */}
          {generationOutput && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Resultado Generado por Google Gemini ({config.geminiModel})
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                  Éxito 200 OK
                </span>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {generationOutput}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Security & Token Optimization Card */}
        <div className="space-y-5">
          {/* Token Metrics Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-100">Maximizador de Créditos</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Token Optimizer</span>
            </div>

            {metrics && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Eficiencia Tokens</span>
                  <span className="text-lg font-bold text-emerald-400">{metrics.efficiencyScore}%</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Ahorro Estimado</span>
                  <span className="text-lg font-bold text-cyan-400">{metrics.estimatedCreditsSavedPercentage}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Tokens Entrada</span>
                  <span className="text-sm font-semibold text-slate-200">{metrics.inputTokens}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-medium">Tokens Salida</span>
                  <span className="text-sm font-semibold text-slate-200">{metrics.outputTokens}</span>
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Presupuesto Máximo Tokens:</span>
                <span className="font-mono text-slate-200">{config.tokenBudgetMax}</span>
              </div>
              <div className="flex justify-between">
                <span>Compresión de Contexto:</span>
                <span className="text-emerald-400 font-medium">Activa</span>
              </div>
              <div className="flex justify-between">
                <span>Costo Estimado Petición:</span>
                <span className="font-mono text-cyan-400">${metrics?.costUSD || "0.0001"} USD</span>
              </div>
            </div>
          </div>

          {/* Security Features Active Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-semibold text-slate-100">Seguridad Integrada en Script</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                <Key className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Autenticación JWT Robusta</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Firma tokens con expiración de {config.jwtExpirationMinutes} mins mediante clave secreta configurable.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-3">
                <Lock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Cifrado AES-256 Fernet</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Capa de cifrado simétrico para proteger credenciales y prompts confidenciales guardados en disco.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
