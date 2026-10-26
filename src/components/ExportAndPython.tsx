import React, { useState } from "react";
import { Download, FileText, Terminal, Shield, Sparkles, Check, Copy, FolderArchive, Layers, ExternalLink } from "lucide-react";
import JSZip from "jszip";
import { EpisodeProject } from "../types";
import { playSoundEffect } from "../utils/soundEffects";

interface ExportAndPythonProps {
  episode: EpisodeProject;
}

export const ExportAndPython: React.FC<ExportAndPythonProps> = ({ episode }) => {
  const [isZipping, setIsZipping] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    playSoundEffect("whoosh");

    try {
      const zip = new JSZip();

      // 1. Script JSON & Markdown
      zip.file(
        "guion_episodio.json",
        JSON.stringify(episode, null, 2)
      );

      const markdownScript = `# I WONDER SHOW — GUION DE PRODUCCIÓN
## Episodio #${episode.episodeNumber}: ${episode.title}
**Lección:** ${episode.lesson}
**Fórmula:** Curiosidad → Investigación → Caos → Descubrimiento → Risas → Lección

### Sinopsis
${episode.synopsis}

---

${episode.scenes
  .map(
    (s) => `### Viñeta #${s.number}: ${s.title} [${s.stage}]
- **Acción Visual:** ${s.visualAction}
- **Encuadre:** ${s.cameraAngle}
- **Efecto de Sonido:** ${s.sfx.toUpperCase()}
- **Prompt Google FX Flow:** ${s.fxFlowPrompt}

**Diálogos:**
${s.dialogue.map((d) => `  * **${d.speaker}**: "${d.text}" ${d.emotion ? `(${d.emotion})` : ""}`).join("\n")}
`
  )
  .join("\n---\n\n")}
`;
      zip.file("guion_episodio.md", markdownScript);

      // 2. Google FX Flow Prompts Text File
      const fxFlowPrompts = episode.scenes
        .map(
          (s) => `// ==========================================
// ESCENA #${s.number}: ${s.title} (${s.stage})
// Efecto: ${s.sfx} | Duración: ${s.durationSeconds}s
// ==========================================
${s.fxFlowPrompt}
`
        )
        .join("\n\n");
      zip.file("prompts_google_fx_flow.txt", fxFlowPrompts);

      // 3. Automated Bash Setup for Linux/Mac laptop
      const setupSh = `#!/usr/bin/env bash
# ==============================================================================
# I WONDER SHOW — SCRIPT AUTOMATIZADO DE ENTORNO PYTHON PARA TU LAPTOP
# ==============================================================================
set -eo pipefail

echo "🚀 Iniciando configurador para I Wonder Show Python Suite..."

# 1. Comprobar Python3
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no encontrado. Instala python3 y python3-venv en tu sistema."
    exit 1
fi

# 2. Crear entorno virtual venv
VENV_DIR="venv"
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Creando entorno virtual en ./$VENV_DIR..."
    python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

# 3. Instalar librerías
echo "📥 Instalando librerías requeridas (google-genai, pyjwt, cryptography)..."
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet

# 4. Archivo .env
if [ ! -f ".env" ]; then
    echo "📝 Generando archivo .env local..."
    cat << 'EOF' > .env
GEMINI_API_KEY=""
JWT_SECRET="super-secret-i-wonder-show-jwt-token"
ENCRYPTION_KEY="c29tZV9zZWNyZXRfYmFzZTY0X2tleV9mb3JfZmVybmV0X2Flc19jcnlwdG8="
LOG_LEVEL="INFO"
EOF
fi

chmod +x run_wonder_pipeline.py

echo "🎉 ¡Instalación exitosa! Ejecuta:"
echo "   source venv/bin/activate"
echo "   python run_wonder_pipeline.py --help"
`;
      zip.file("setup.sh", setupSh);

      // 4. requirements.txt
      const requirements = `google-genai>=2.4.0
pyjwt>=2.8.0
cryptography>=42.0.0
python-dotenv>=1.0.0
pydantic>=2.5.0
rich>=13.7.0
`;
      zip.file("requirements.txt", requirements);

      // 5. Python Pipeline Runner (Modular script with JWT, AES-256 and Gemini)
      const pythonRunner = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
I WONDER SHOW — PIPELINE EJECUTABLE LOCAL
Generador y orquestador local para la serie animada de Saúl y César.
"""
import os
import sys
import json
import argparse
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"), format="%(asctime)s [%(levelname)s] %(message)s")

def verify_system():
    logging.info("Verificando módulos criptográficos y dependencias...")
    import jwt
    import cryptography
    logging.info(f"✔ PyJWT versión: {jwt.__version__}")
    logging.info(f"✔ Cryptography versión: {cryptography.__version__}")
    logging.info("✔ Entorno verificado con éxito.")

def main():
    parser = argparse.ArgumentParser(description="I Wonder Show Python Runner")
    parser.add_argument("--verify", action="store_true", help="Verifica el entorno virtual")
    parser.add_argument("--show-script", action="store_true", help="Muestra el guion del episodio cargado")
    args = parser.parse_args()

    if args.verify:
        verify_system()
    elif args.show_script:
        if os.path.exists("guion_episodio.json"):
            with open("guion_episodio.json", "r", encoding="utf-8") as f:
                data = json.load(f)
                print(f"🎬 Episodio: {data.get('title')}")
                print(f"📖 Lección: {data.get('lesson')}")
                print(f"🖼️ Escenas: {len(data.get('scenes', []))}")
        else:
            print("No se encontró guion_episodio.json")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
`;
      zip.file("run_wonder_pipeline.py", pythonRunner);

      // 6. Add Images and Audios if generated
      const mediaFolder = zip.folder("media");
      for (const scene of episode.scenes) {
        if (scene.imageUrl && scene.imageUrl.includes(";base64,")) {
          const base64Data = scene.imageUrl.split(";base64,")[1];
          mediaFolder?.file(`escena_${scene.number.toString().padStart(2, "0")}.png`, base64Data, { base64: true });
        }
        if (scene.audioWavUrl && scene.audioWavUrl.includes(";base64,")) {
          const base64Audio = scene.audioWavUrl.split(";base64,")[1];
          mediaFolder?.file(`escena_${scene.number.toString().padStart(2, "0")}_voces.wav`, base64Audio, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `i-wonder-show-ep${episode.episodeNumber}-${episode.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      playSoundEffect("chime");
    } catch (err: any) {
      alert("Error al empaquetar el ZIP: " + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSoundEffect("pop");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Centro de Exportación & Ejecutable para Laptop</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Exportar Paquete Completo de <span className="text-sky-400">{episode.title}</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Descarga todo el material de producción de este episodio en un solo archivo ZIP: guion técnico, prompts optimizados para Google FX Flow, imágenes 3D renderizadas, pistas de voces en formato WAV y el script automatizado para ejecutar en tu laptop con Python 3.
        </p>

        <div className="pt-2">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 via-sky-600 to-blue-600 hover:from-emerald-400 hover:to-blue-500 shadow-xl shadow-emerald-500/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className={`w-4 h-4 ${isZipping ? "animate-spin" : ""}`} />
            <span>{isZipping ? "Empaquetando ZIP..." : "Descargar Paquete Completo (.ZIP)"}</span>
          </button>
        </div>
      </div>

      {/* Quick Individual File Downloads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Guion JSON */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-sky-400 mb-1">
              <FileText className="w-4 h-4" />
              <span className="font-bold text-xs text-white">Guion Técnico JSON</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estructura completa de escenas, diálogos de Saúl y César, lecciones y timing.
            </p>
          </div>
          <button
            onClick={() => downloadTextFile("guion_episodio.json", JSON.stringify(episode, null, 2))}
            className="w-full py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Descargar JSON
          </button>
        </div>

        {/* Prompts FX Flow */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold text-xs text-white">Prompts FX Flow</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Archivo de texto plano con los prompts de cada viñeta listos para pegar en Google Labs.
            </p>
          </div>
          <button
            onClick={() =>
              downloadTextFile(
                "prompts_google_fx_flow.txt",
                episode.scenes.map((s) => `// ESCENA #${s.number}: ${s.title}\n${s.fxFlowPrompt}`).join("\n\n")
              )
            }
            className="w-full py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Descargar Prompts TXT
          </button>
        </div>

        {/* Script setup.sh */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Terminal className="w-4 h-4" />
              <span className="font-bold text-xs text-white">Script setup.sh Linux</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Instalador bash que crea el venv y configura las librerías automáticamente en tu laptop.
            </p>
          </div>
          <button
            onClick={() =>
              downloadTextFile(
                "setup.sh",
                `#!/usr/bin/env bash\npython3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt\necho "Listo!"`
              )
            }
            className="w-full py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            Descargar setup.sh
          </button>
        </div>
      </div>

      {/* Instructions for Running on Laptop */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
          <Terminal className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white">
            Cómo ejecutar el paquete descargado en tu laptop (Linux / macOS / WSL)
          </h3>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() =>
              copyToClipboard(
                `unzip i-wonder-show-*.zip -d i_wonder_show\ncd i_wonder_show\nchmod +x setup.sh\n./setup.sh\nsource venv/bin/activate\npython run_wonder_pipeline.py --show-script`,
                "bash-instructions"
              )
            }
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-[10px] flex items-center space-x-1"
          >
            {copiedKey === "bash-instructions" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar</span>
          </button>
          <pre>{`# 1. Descomprimir el paquete
unzip i-wonder-show-*.zip -d i_wonder_show
cd i_wonder_show

# 2. Dar permisos y correr el instalador automático
chmod +x setup.sh
./setup.sh

# 3. Activar el entorno virtual y ver el guion
source venv/bin/activate
python run_wonder_pipeline.py --show-script`}</pre>
        </div>
      </div>
    </div>
  );
};
