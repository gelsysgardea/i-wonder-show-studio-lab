import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  RefreshCw,
  FileText,
  Copy,
  Check,
  Code2,
  AlertCircle,
  Compass,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ImageAnalysisResult, WebReference, BundleConfig } from "../types";

interface ImageSearchAnalyzerProps {
  config: BundleConfig;
}

export const ImageSearchAnalyzer: React.FC<ImageSearchAnalyzerProps> = ({ config }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ name: string; sizeKb: number; mimeType: string } | null>(null);
  const [promptText, setPromptText] = useState<string>(
    "Analiza detalladamente esta imagen. Identifica el objeto, lugar, obra, producto, marca, texto o concepto. Utiliza la búsqueda de Google para encontrar páginas web de referencia, fuentes oficiales, enlaces y contexto actualizado."
  );
  const [selectedModel, setSelectedModel] = useState<string>("gemini-3.5-flash");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample Images for instant testing
  const sampleImages = [
    {
      name: "Monumento Histórico (Torre Eiffel)",
      url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80",
      description: "Ejemplo de arquitectura y lugares emblemáticos",
    },
    {
      name: "Tecnología e Inteligencia Artificial",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      description: "Arte abstracto digital y concepto de IA",
    },
    {
      name: "Naturaleza y Biodiversidad",
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      description: "Paisaje natural e identificación ambiental",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Por favor, selecciona un archivo de imagen válido (PNG, JPG, WEBP).");
      return;
    }

    setErrorMsg(null);
    const sizeKb = Math.round(file.size / 1024);
    const mimeType = file.type || "image/jpeg";

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setImageMeta({ name: file.name, sizeKb, mimeType });
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample: typeof sampleImages[0]) => {
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      // Fetch sample image convert to base64
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setImageMeta({ name: sample.name + ".jpg", sizeKb: Math.round(blob.size / 1024) || 240, mimeType: "image/jpeg" });
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      setSelectedImage(sample.url);
      setImageMeta({ name: sample.name + ".jpg", sizeKb: 200, mimeType: "image/jpeg" });
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setErrorMsg("Debes cargar una imagen o seleccionar una muestra antes de analizar.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const apiPayload = {
        image: selectedImage,
        mimeType: imageMeta?.mimeType || "image/jpeg",
        prompt: promptText,
        model: selectedModel,
      };

      const res = await fetch("/api/image/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al realizar el análisis visual con la API.");
      }

      setResult({
        analysisText: data.analysis,
        searchQueries: data.searchQueries || [],
        webReferences: data.webReferences || [],
        modelUsed: data.modelUsed || selectedModel,
        timestamp: new Date().toLocaleTimeString(),
        imageUrl: selectedImage,
        imageFileName: imageMeta?.name || "imagen_cargada.jpg",
        imageSizeKb: imageMeta?.sizeKb || 150,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error al conectar con la API de análisis de imagen.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, type: "url" | "code") => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const pythonSnippet = `# Código ejecutable Python para tu laptop (usando src/image_analyzer.py)
from src.image_analyzer import ImageAnalyzer

analyzer = ImageAnalyzer(model_name="${selectedModel}")
resultado = analyzer.analyze_image_file(
    image_path="${imageMeta?.name || 'imagen.jpg'}",
    custom_prompt="${promptText.replace(/\n/g, ' ')}"
)

print("--- ANÁLISIS VISUAL Y GOOGLE SEARCH GROUNDING ---")
print(resultado["analysis_text"])

print("\\n--- BÚSQUEDAS EN GOOGLE ---")
for query in resultado.get("search_queries", []):
    print(f"- {query}")

print("\\n--- PÁGINAS WEB DE REFERENCIA ENCONTRADAS ---")
for ref in resultado.get("web_references", []):
    print(f"• {ref['title']}: {ref['url']}")
`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Google Search Grounding + Visual Multimodal</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Analizador de Imágenes y Páginas Web de Referencia</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Carga cualquier imagen o fotografía. Gemini identificará los elementos clave y realizará una búsqueda en Google para encontrar las páginas web de referencia, fuentes oficiales y contexto actualizado en tiempo real.
            </p>
          </div>

          <div className="shrink-0 flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-2 font-medium">Modelo:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-900 text-cyan-300 font-mono rounded-lg px-2.5 py-1 border border-slate-800 focus:outline-none"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (Búsqueda Rápida)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Análisis Profundo)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Upload & Controls, Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Options (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* File Upload Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>1. Cargar Imagen para Analizar</span>
              </span>
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImageMeta(null);
                    setResult(null);
                  }}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  Quitar Imagen
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
                <img
                  src={selectedImage}
                  alt="Imagen seleccionada"
                  className="w-full h-56 object-cover object-center"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cambiar Imagen</span>
                  </button>
                </div>

                {imageMeta && (
                  <div className="p-2.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="truncate max-w-[180px]">{imageMeta.name}</span>
                    <span>{imageMeta.sizeKb} KB</span>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/50 hover:bg-slate-950 rounded-xl p-8 text-center cursor-pointer transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-cyan-500/30 flex items-center justify-center mx-auto text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-200">
                    Haz clic o arrastra tu imagen aquí
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Soporta formatos JPG, PNG, WEBP, GIF hasta 10MB
                  </p>
                </div>
              </div>
            )}

            {/* Preset Samples */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                O prueba con estas imágenes de muestra:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sampleImages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(sample)}
                    className="relative group rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 text-left transition-all bg-slate-950"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-16 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 p-1 flex items-end">
                      <span className="text-[9px] font-medium text-slate-200 truncate leading-tight">
                        {sample.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prompt & Action Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span>2. Instrucciones para la Búsqueda</span>
                <span className="text-[10px] text-slate-500 font-normal">Personalizable</span>
              </label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none leading-relaxed"
                placeholder="Escribe lo que deseas investigar sobre esta imagen..."
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing || !selectedImage}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Buscando Referencias en Google...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analizar Imagen y Buscar Referencias</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Results & Web Pages (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {isAnalyzing ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-md flex flex-col items-center justify-center min-h-[420px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 animate-pulse">
                  <Globe className="w-8 h-8" />
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-100">
                  Ejecutando Google Search Grounding Multimodal
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Gemini está analizando la composición de la imagen y consultando el índice de Google para encontrar las páginas web de referencia exactas...
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Queries performed badge banner */}
              {result.searchQueries.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Búsquedas ejecutadas en Google:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.searchQueries.map((q, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] flex items-center space-x-1"
                      >
                        <span>"{q}"</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Web Page References List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-100">
                      Páginas Web y Fuentes de Referencia Encontradas ({result.webReferences.length})
                    </h3>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                    Verificado en Google
                  </span>
                </div>

                {result.webReferences.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {result.webReferences.map((ref, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                            {ref.title}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                            {ref.url}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => copyToClipboard(ref.url, "url")}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition-all text-[10px] flex items-center space-x-1"
                            title="Copiar URL"
                          >
                            {copiedUrl === ref.url ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg border border-blue-500/30 transition-all flex items-center space-x-1 text-xs font-medium px-2.5"
                          >
                            <span>Visitar</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                    No se generaron enlaces externos explícitos en esta consulta, consulta la descripción a continuación.
                  </div>
                )}
              </div>

              {/* Detailed Visual Analysis Text */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    Análisis de Visión e Inteligencia de Contexto
                  </h3>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs leading-relaxed text-slate-300 space-y-3 whitespace-pre-wrap font-sans">
                  {result.analysisText}
                </div>
              </div>

              {/* Python Executable Code Snippet */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-slate-100">
                      Código Python para Ejecutar en tu Laptop (src/image_analyzer.py)
                    </h3>
                  </div>

                  <button
                    onClick={() => copyToClipboard(pythonSnippet, "code")}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto custom-scrollbar">
                  <pre className="whitespace-pre">{pythonSnippet}</pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-md flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                <Compass className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-200">
                  Esperando selección de imagen
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Carga tu propia imagen o haz clic en una de las muestras de prueba para iniciar la búsqueda de referencias en Google.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
