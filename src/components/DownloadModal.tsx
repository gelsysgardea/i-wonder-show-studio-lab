import React, { useState } from "react";
import { X, Download, CheckCircle2, FileArchive, Terminal, Shield, RefreshCw } from "lucide-react";
import JSZip from "jszip";
import { BundleConfig, GeneratedFile } from "../types";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BundleConfig;
  files: GeneratedFile[];
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  config,
  files,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsZipping(true);
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();
      const folderName = config.projectName || "google-fx-flow-bundle";
      const rootFolder = zip.folder(folderName);

      files.forEach((file) => {
        if (rootFolder) {
          rootFolder.file(file.path, file.content);
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(content);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${folderName}-laptop-executable.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
    } catch (error) {
      console.error("Error al generar ZIP:", error);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileArchive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Descargar Paquete Laptop (.ZIP)
            </h3>
            <span className="text-xs text-cyan-400 font-mono">
              {config.projectName}-v{config.version}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Obtendrás un archivo comprimido listo para descomprimir en tu laptop. Incluye el entorno virtual automatizado (<code className="font-mono text-cyan-300">setup.sh</code>), el script ejecutable (<code className="font-mono text-cyan-300">main.py</code>), autenticación JWT, cifrado AES-256 en reposo, manifestos Docker/Kubernetes y la suite de verificación pytest.
        </p>

        {/* File summary list */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 mb-6 max-h-48 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Archivos incluidos ({files.length}):
          </div>
          {files.map((f) => (
            <div key={f.path} className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="truncate max-w-xs">{f.path}</span>
              <span className="text-[10px] text-slate-500 uppercase">{f.category}</span>
            </div>
          ))}
        </div>

        {/* Status Notification */}
        {downloadSuccess && (
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl text-xs text-emerald-300 flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>¡Archivo ZIP descargado con éxito a tu laptop!</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cerrar
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
          >
            {isZipping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generando ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar ZIP Completo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
