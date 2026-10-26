import React, { useState, useEffect } from "react";
import { Play, Terminal, CheckCircle2, RefreshCw, Copy, Shield, Key, AlertTriangle } from "lucide-react";
import { BundleConfig } from "../types";

interface TerminalSimulatorProps {
  config: BundleConfig;
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({ config }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  const terminalSteps = [
    { title: "Verificando permisos y entorno OS...", delay: 400, text: `[1/6] Verificando permisos en /home/user/workspace... OK (Non-root user detected ID: 1000)` },
    { title: "Comprobando Python 3 y venv...", delay: 600, text: `[2/6] Python detectado: Python ${config.pythonVersion}.8 (x86_64-pc-linux-gnu)` },
    { title: "Creando entorno virtual (venv)...", delay: 800, text: `[3/6] Creando venv en ./venv ... Virtualenv activo: (venv)` },
    { title: "Instalando dependencias desde requirements.txt...", delay: 1200, text: `[4/6] pip install -r requirements.txt\n  Collecting google-genai>=1.0.0 (Installed v1.2.0)\n  Collecting pyjwt>=2.8.0 (Installed v2.8.0)\n  Collecting cryptography>=42.0.0 (Installed v42.0.5)\n  Collecting python-dotenv (Installed v1.0.1)` },
    { title: "Configurando variables de entorno (.env)...", delay: 700, text: `[5/6] Archivo .env generado correctamente:\n  JWT_SECRET="${config.jwtSecret.substring(0, 12)}..."\n  ENCRYPTION_KEY="${config.encryptionKey.substring(0, 16)}..."\n  LOG_LEVEL="${config.logLevel}"` },
    { title: "Ejecutando verificador automatizado python main.py --verify...", delay: 1000, text: `[6/6] python main.py --verify\n  ✔ [1] JWT Auth Module: Validated signature (Expiration: ${config.jwtExpirationMinutes}m)\n  ✔ [2] Fernet AES-256 Vault: Encrypted & Decrypted payload at rest\n  ✔ [3] Token Optimizer: Evaluated budget (Max: ${config.tokenBudgetMax} tokens)\n  ✔ [4] Google Gemini SDK: Initialized model (${config.geminiModel})` },
  ];

  const handleRunSimulation = () => {
    setIsRunning(true);
    setStepIndex(0);
    setLogs(["🚀 Iniciando bash setup.sh en entorno Linux..."]);

    let current = 0;
    const interval = setInterval(() => {
      if (current < terminalSteps.length) {
        setLogs((prev) => [...prev, terminalSteps[current].text]);
        setStepIndex(current + 1);
        current++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setLogs((prev) => [
          ...prev,
          `\n======================================================================`,
          `  🎉 ¡INSTALACIÓN Y VERIFICACIÓN COMPLETADAS CON ÉXITO!`,
          `======================================================================`,
          `Instrucciones de uso en tu laptop:`,
          `  1. Activa el entorno virtual: source venv/bin/activate`,
          `  2. Ejecuta el script: python main.py --run-flow`,
          `  3. Prueba la suite: pytest tests/`
        ]);
      }
    }, 800);
  };

  useEffect(() => {
    handleRunSimulation();
  }, [config.projectName]);

  const handleCopyBashCommands = () => {
    const cmd = `chmod +x setup.sh\n./setup.sh`;
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Simulador Interactivo de Ejecución setup.sh</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simula paso a paso la automatización de la instalación, entorno venv, dependencias y verificación en Linux.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyBashCommands}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>{copiedCmd ? "Copiado!" : "Copiar chmod +x setup.sh"}</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
          >
            {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>Reejecutar Simulador</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Screen */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-slate-400 text-[11px] ml-2">bash - setup.sh (Linux Ubuntu 22.04 LTS)</span>
          </div>

          <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wide">
            {isRunning ? "EJECUTANDO PASOS..." : "PROCESO COMPLETADO"}
          </div>
        </div>

        <div className="p-5 space-y-2 min-h-[360px] max-h-[500px] overflow-y-auto text-slate-300 leading-relaxed custom-scrollbar">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap ${
                log.includes("✔")
                  ? "text-emerald-400"
                  : log.includes("🚀") || log.includes("🎉")
                  ? "text-cyan-300 font-semibold"
                  : log.includes("ERROR")
                  ? "text-red-400 font-semibold"
                  : "text-slate-300"
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
