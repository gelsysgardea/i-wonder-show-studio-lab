import React, { useState } from "react";
import { Settings, Shield, Key, Lock, Cpu, Server, Plus, Trash2, RefreshCw, Check } from "lucide-react";
import { BundleConfig } from "../types";

interface BundleConfiguratorProps {
  config: BundleConfig;
  onUpdateConfig: (updated: Partial<BundleConfig>) => void;
}

export const BundleConfigurator: React.FC<BundleConfiguratorProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateRandomSecret = (length = 32) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateBase64FernetKey = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return btoa(String.fromCharCode(...randomBytes));
  };

  const handleAddEnvVar = () => {
    const newVars = [
      ...config.customEnvVars,
      { key: "MI_VARIABLE_PERSONALIZADA", value: "valor_por_defecto", comment: "Variable de entorno personalizada" },
    ];
    onUpdateConfig({ customEnvVars: newVars });
  };

  const handleRemoveEnvVar = (index: number) => {
    const newVars = config.customEnvVars.filter((_, idx) => idx !== index);
    onUpdateConfig({ customEnvVars: newVars });
  };

  const handleEnvVarChange = (index: number, field: "key" | "value" | "comment", val: string) => {
    const newVars = [...config.customEnvVars];
    newVars[index][field] = val;
    onUpdateConfig({ customEnvVars: newVars });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Configurador del Paquete Python Ejecutable
            </h2>
            <p className="text-xs text-slate-400">
              Personaliza el nombre, llaves de seguridad JWT, cifrado AES-256 Fernet, entorno virtual y manifiestos de Docker/Kubernetes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Metadata */}
          <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>1. Identificación del Proyecto</span>
            </h3>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                value={config.projectName}
                onChange={(e) => onUpdateConfig({ projectName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Versión
                </label>
                <input
                  type="text"
                  value={config.version}
                  onChange={(e) => onUpdateConfig({ version: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Versión Python
                </label>
                <select
                  value={config.pythonVersion}
                  onChange={(e) => onUpdateConfig({ pythonVersion: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
                >
                  <option value="3.10">Python 3.10</option>
                  <option value="3.11">Python 3.11</option>
                  <option value="3.12">Python 3.12</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Autor / Creador
              </label>
              <input
                type="text"
                value={config.author}
                onChange={(e) => onUpdateConfig({ author: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Security & Authentication */}
          <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>2. Seguridad JWT y Cifrado AES-256</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Clave Secreta JWT_SECRET</span>
                </label>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ jwtSecret: generateRandomSecret(32) })}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generar Aleatoria</span>
                </button>
              </div>
              <input
                type="text"
                value={config.jwtSecret}
                onChange={(e) => onUpdateConfig({ jwtSecret: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Clave de Cifrado Fernet (AES-256)</span>
                </label>
                <button
                  type="button"
                  onClick={() => onUpdateConfig({ encryptionKey: generateBase64FernetKey() })}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Generar Key Base64</span>
                </button>
              </div>
              <input
                type="text"
                value={config.encryptionKey}
                onChange={(e) => onUpdateConfig({ encryptionKey: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Expiración JWT (Minutos)
                </label>
                <input
                  type="number"
                  value={config.jwtExpirationMinutes}
                  onChange={(e) => onUpdateConfig({ jwtExpirationMinutes: parseInt(e.target.value) || 60 })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">
                  Nivel de Logs (Logging)
                </label>
                <select
                  value={config.logLevel}
                  onChange={(e) => onUpdateConfig({ logLevel: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
                >
                  <option value="DEBUG">DEBUG (Detallado)</option>
                  <option value="INFO">INFO (Normal)</option>
                  <option value="WARNING">WARNING (Advertencias)</option>
                  <option value="ERROR">ERROR (Críticos)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Environment Variables Section */}
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>3. Variables de Entorno Personalizadas (.env)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Añade parámetros personalizados que serán cargados automáticamente mediante python-dotenv.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddEnvVar}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Variable</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.customEnvVars.map((env, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800/80 items-center"
              >
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={env.key}
                    onChange={(e) => handleEnvVarChange(idx, "key", e.target.value)}
                    placeholder="NOMBRE_VARIABLE"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={env.value}
                    onChange={(e) => handleEnvVarChange(idx, "value", e.target.value)}
                    placeholder="Valor"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={env.comment}
                    onChange={(e) => handleEnvVarChange(idx, "comment", e.target.value)}
                    placeholder="Comentario explicativo"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 focus:border-cyan-500/50 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveEnvVar(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Docker & Kubernetes Configuration */}
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>4. Configuración de Despliegue (Docker & Kubernetes)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Namespace de Kubernetes
              </label>
              <input
                type="text"
                value={config.k8sNamespace}
                onChange={(e) => onUpdateConfig({ k8sNamespace: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Réplicas Iniciales (Pods)
              </label>
              <input
                type="number"
                value={config.k8sReplicas}
                onChange={(e) => onUpdateConfig({ k8sReplicas: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Puerto Expuesto
              </label>
              <input
                type="number"
                value={config.port}
                onChange={(e) => onUpdateConfig({ port: parseInt(e.target.value) || 3000 })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
