import React, { useState } from "react";
import { X, Key, Shield, Lock, FileText, ExternalLink, Copy, Check, RefreshCw, HelpCircle, Sparkles } from "lucide-react";
import { BundleConfig } from "../types";

interface CredentialsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BundleConfig;
  onUpdateConfig: (updated: Partial<BundleConfig>) => void;
}

export const CredentialsGuideModal: React.FC<CredentialsGuideModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateNewJwtSecret = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onUpdateConfig({ jwtSecret: result });
  };

  const generateNewEncryptionKey = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    const key = btoa(String.fromCharCode(...randomBytes));
    onUpdateConfig({ encryptionKey: key });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>¿De dónde saco estas claves y variables?</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">Guía Rápida</span>
              </h3>
              <p className="text-xs text-slate-400">
                Aclaración sobre cada una de las credenciales solicitadas por el entorno.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          {/* Card 1: GEMINI_API_KEY */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-100 text-sm">1. GEMINI_API_KEY</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-medium">Servicio Oficial Google</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] transition-colors"
              >
                <span>Obtener en Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-300 text-xs">
              <strong className="text-cyan-300">¿De dónde sale?</strong> Es la única clave externa real. La proporciona Google de forma <strong>100% gratuita</strong> para desarrolladores.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
              <li>Haz clic en el botón azul <strong className="text-slate-200">"Obtener en Google AI Studio"</strong> o entra a <code className="text-cyan-300 font-mono">aistudio.google.com/app/apikey</code>.</li>
              <li>Inicia sesión con tu cuenta de Google (Gmail).</li>
              <li>Haz clic en <strong className="text-slate-200">"Create API key"</strong> (Crear clave de API).</li>
              <li>Cópiala y úsala en tu archivo <code className="text-slate-200 font-mono">.env</code> de tu laptop o en el panel de secretos.</li>
            </ol>
          </div>

          {/* Card 2: JWT_SECRET */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Key className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-slate-100 text-sm">2. JWT_SECRET</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-medium">Clave Autogenerada</span>
              </div>
              <button
                onClick={generateNewJwtSecret}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generar nueva</span>
              </button>
            </div>
            <p className="text-slate-300 text-xs">
              <strong className="text-indigo-300">¿De dónde sale?</strong> <strong className="text-rose-300">¡NO la busques en internet ni en ninguna web!</strong> Es solo una frase secreta de seguridad que tú te inventas (o que esta app genera automáticamente) para firmar y verificar tokens de autenticación en Python.
            </p>
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              <span className="truncate mr-2">{config.jwtSecret}</span>
              <button
                onClick={() => handleCopy(config.jwtSecret, "jwt")}
                className="text-slate-400 hover:text-slate-200 flex items-center space-x-1"
              >
                {copiedId === "jwt" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar</span>
              </button>
            </div>
          </div>

          {/* Card 3: ENCRYPTION_KEY */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-100 text-sm">3. ENCRYPTION_KEY</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-medium">Cifrado Fernet AES-256</span>
              </div>
              <button
                onClick={generateNewEncryptionKey}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generar nueva base64</span>
              </button>
            </div>
            <p className="text-slate-300 text-xs">
              <strong className="text-emerald-300">¿De dónde sale?</strong> <strong className="text-rose-300">¡Tampoco viene de ninguna página web!</strong> Es una clave matemática de 32 bytes codificada en base64 para que el módulo de Python <code className="text-emerald-300 font-mono">cryptography (Fernet)</code> cifre los datos en reposo en tu laptop. La app ya te generó una válida:
            </p>
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300">
              <span className="truncate mr-2">{config.encryptionKey}</span>
              <button
                onClick={() => handleCopy(config.encryptionKey, "enc")}
                className="text-slate-400 hover:text-slate-200 flex items-center space-x-1"
              >
                {copiedId === "enc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar</span>
              </button>
            </div>
          </div>

          {/* Card 4: LOG_LEVEL */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-100 text-sm">4. LOG_LEVEL</span>
            </div>
            <p className="text-slate-300 text-xs">
              <strong className="text-amber-300">¿De dónde sale?</strong> Es simplemente una palabra de configuración para el sistema de logs.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-center">
              <span className="bg-slate-900 border border-slate-800 py-1 rounded text-cyan-300">DEBUG (Detallado)</span>
              <span className="bg-slate-900 border border-slate-800 py-1 rounded text-emerald-300">INFO (Recomendado)</span>
              <span className="bg-slate-900 border border-slate-800 py-1 rounded text-amber-300">WARNING (Alertas)</span>
              <span className="bg-slate-900 border border-slate-800 py-1 rounded text-rose-300">ERROR (Críticos)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Al descargar el ZIP, el script <code className="text-slate-200 font-mono">setup.sh</code> configurará estas claves automáticamente en tu laptop.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
