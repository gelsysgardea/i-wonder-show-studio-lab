import React, { useState } from "react";
import { FileCode, Copy, Check, Download, Search, Terminal, Shield, Settings, FileText, Server } from "lucide-react";
import { GeneratedFile } from "../types";

interface CodeViewerProps {
  files: GeneratedFile[];
  onDownloadSingleFile: (file: GeneratedFile) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ files, onDownloadSingleFile }) => {
  const [selectedPath, setSelectedPath] = useState<string>("setup.sh");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = files.find((f) => f.path === selectedPath) || files[0];

  const handleCopyCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = files.filter(
    (f) =>
      f.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "script":
        return <Terminal className="w-3.5 h-3.5 text-cyan-400" />;
      case "security":
        return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
      case "config":
        return <Settings className="w-3.5 h-3.5 text-indigo-400" />;
      case "deploy":
        return <Server className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
      {/* File Explorer Sidebar */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-md overflow-hidden">
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar archivo (main.py, setup.sh...)"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Archivos del Paquete ({filteredFiles.length})
        </div>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {filteredFiles.map((f) => {
            const isSelected = f.path === selectedPath;
            return (
              <button
                key={f.path}
                onClick={() => setSelectedPath(f.path)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start space-x-2.5 border ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500/50 text-white shadow-sm"
                    : "bg-slate-950/50 border-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="mt-0.5 shrink-0">{getCategoryIcon(f.category)}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono font-medium truncate">{f.path}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{f.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Content Viewer */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-full shadow-md overflow-hidden">
        {/* Header toolbar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-mono text-xs font-semibold text-slate-200 truncate">
              {activeFile?.path}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono uppercase">
              {activeFile?.language}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={() => activeFile && onDownloadSingleFile(activeFile)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          </div>
        </div>

        {/* Code view area */}
        <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200 custom-scrollbar">
          <pre className="whitespace-pre">{activeFile?.content}</pre>
        </div>
      </div>
    </div>
  );
};
