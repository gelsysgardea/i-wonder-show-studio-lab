import React, { useState } from "react";
import { BookOpen, Copy, Check, Terminal, Shield, Server, Cpu, CheckCircle2, HelpCircle, Key, Lock, ExternalLink, Sparkles } from "lucide-react";
import { BundleConfig } from "../types";

interface DocumentationTabProps {
  config: BundleConfig;
}

export const DocumentationTab: React.FC<DocumentationTabProps> = ({ config }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Title Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Documentación Técnica Completa de Despliegue y Verificación
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Guía paso a paso para la instalación en tu laptop (Linux/macOS), verificación con tests unitarios, autenticación JWT, cifrado en reposo y despliegue en contenedores Docker o clústeres de Kubernetes.
        </p>
      </div>

      {/* Section 0: Credentials Guide */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Guía Esencial: ¿De dónde saco cada clave y variable de entorno?
            </h3>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
            Pregunta Frecuente
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Si te encuentras con peticiones de configuración de variables o un archivo <code className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono">.env</code>, aquí tienes el origen exacto de cada una:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* GEMINI_API_KEY */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                GEMINI_API_KEY
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Obtener Gratis</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400">
              <strong className="text-slate-200">¿De dónde sale?</strong> Es la única clave externa. Se obtiene en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-mono">aistudio.google.com/app/apikey</a> con tu cuenta de Google. Haces clic en <em>"Create API key"</em>, es 100% gratuita.
            </p>
          </div>

          {/* JWT_SECRET */}
          <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-400" />
              JWT_SECRET
            </span>
            <p className="text-[11px] text-slate-400">
              <strong className="text-slate-200">¿De dónde sale?</strong> <span className="text-amber-300 font-medium">¡NO viene de internet!</span> Es una contraseña larga inventada por ti o generada al azar (ej. con <code className="text-slate-300 font-mono">openssl rand -hex 32</code>) que usa tu código Python para firmar tokens JWT.
            </p>
          </div>

          {/* ENCRYPTION_KEY */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              ENCRYPTION_KEY
            </span>
            <p className="text-[11px] text-slate-400">
              <strong className="text-slate-200">¿De dónde sale?</strong> <span className="text-amber-300 font-medium">¡Tampoco viene de ninguna web!</span> Es una clave criptográfica de 32 bytes en base64 para AES-256 Fernet. La app y el script <code className="text-slate-300 font-mono">setup.sh</code> ya la generan de forma automática.
            </p>
          </div>

          {/* LOG_LEVEL */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              LOG_LEVEL
            </span>
            <p className="text-[11px] text-slate-400">
              <strong className="text-slate-200">¿De dónde sale?</strong> Es simplemente una palabra que define el detalle de la consola: <code className="text-cyan-300 font-mono">DEBUG</code>, <code className="text-emerald-300 font-mono">INFO</code>, <code className="text-amber-300 font-mono">WARNING</code> o <code className="text-rose-300 font-mono">ERROR</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Quick Start Linux */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">
            1. Instalación y Automatización en Laptop (Linux/macOS)
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          El paquete descargable contiene el script automatizado <code className="bg-slate-950 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-800 font-mono">setup.sh</code> que gestiona todo el ciclo de vida inicial de tu entorno Python.
        </p>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() => copySnippet("chmod +x setup.sh\n./setup.sh", "sec1")}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-[10px] flex items-center space-x-1"
          >
            {copiedCode === "sec1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar</span>
          </button>
          <pre>{`# Dar permisos de ejecución y correr el instalador
chmod +x setup.sh
./setup.sh`}</pre>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
          <span className="font-semibold text-slate-200 block">¿Qué hace automáticamente el script?</span>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Valida que exista Python {config.pythonVersion} y el módulo <code className="text-slate-200 font-mono">python3-venv</code>.</li>
            <li>Crea un entorno virtual aislado en <code className="text-slate-200 font-mono">./venv</code>.</li>
            <li>Actualiza pip e instala las librerías desde <code className="text-slate-200 font-mono">requirements.txt</code>.</li>
            <li>Genera el archivo de variables <code className="text-slate-200 font-mono">.env</code> con las claves criptográficas.</li>
            <li>Ejecuta el autoservicio <code className="text-slate-200 font-mono">python main.py --verify</code>.</li>
          </ul>
        </div>
      </div>

      {/* Section 2: Verification */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200">
            2. Instrucciones para Verificar la Instalación Exitosa
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Para confirmar que la instalación fue correcta y que todos los módulos de seguridad (JWT, AES-256) están listos, ejecuta las pruebas de integración:
        </p>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() => copySnippet("source venv/bin/activate\npython main.py --verify\npytest tests/", "sec2")}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-[10px] flex items-center space-x-1"
          >
            {copiedCode === "sec2" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar</span>
          </button>
          <pre>{`# 1. Activa el entorno virtual
source venv/bin/activate

# 2. Ejecuta la prueba de verificación integrada
python main.py --verify

# 3. Ejecuta la suite de pruebas unitarias pytest
pytest tests/`}</pre>
        </div>
      </div>

      {/* Section 3: JWT & Encryption */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">
            3. Autenticación JWT y Cifrado AES-256 Fernet
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-indigo-300 block">Módulo JWT (jwt_auth.py)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Firma y valida JSON Web Tokens con expiración de {config.jwtExpirationMinutes} minutos. Garantiza que solo llamadas autenticadas accedan al pipeline creativo de Google FX Flow.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-emerald-300 block">Cifrado AES-256 (crypto_vault.py)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Capa de cifrado simétrico en reposo con algoritmos derivados de SHA-256 y Fernet. Protege credenciales y prompts confidenciales en el sistema de archivos local.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Docker & K8s */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Server className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200">
            4. Despliegue en Docker y Kubernetes
          </h3>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() => copySnippet(`docker build -t ${config.projectName}:${config.version} .\ndocker run --rm --env-file .env ${config.projectName}:${config.version} --verify\n\n# Kubernetes:\nkubectl apply -f k8s/secrets.yaml\nkubectl apply -f k8s/deployment.yaml`, "sec4")}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-[10px] flex items-center space-x-1"
          >
            {copiedCode === "sec4" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar</span>
          </button>
          <pre>{`# Construir e iniciar en Docker
docker build -t ${config.projectName}:${config.version} .
docker run --rm --env-file .env ${config.projectName}:${config.version} --verify

# Despliegue en Kubernetes
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl get pods -n ${config.k8sNamespace}`}</pre>
        </div>
      </div>
    </div>
  );
};
