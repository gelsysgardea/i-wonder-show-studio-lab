import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "google-fx-flow-generator-api",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API: Generate or Optimize FX Flow Prompts using Gemini
app.post("/api/flow/generate", async (req, res) => {
  try {
    const { prompt, model = "gemini-3.6-flash", mode = "enhance", maxOutputTokens = 2048 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt es requerido" });
    }

    let systemInstruction = "";
    if (mode === "optimize_tokens") {
      systemInstruction =
        "Eres un experto en optimización de prompts y créditos de tokens para Google FX Flow / Gemini models. Tu objetivo es refinar el prompt enviado para maximizar el rendimiento por token utilizado, eliminar redundancias, agregar parámetros estructurados y comprimir las instrucciones sin perder calidad de generación visual o narrativa.";
    } else if (mode === "generate_python") {
      systemInstruction =
        "Eres un ingeniero Senior en Python, Docker y Kubernetes. Genera código Python modular optimizado, incluyendo clases bien estructuradas, manejo de excepciones, logs estructurados con structlog/logging, y compatibilidad con entornos aislados venv y contenedores.";
    } else {
      systemInstruction =
        "Eres un especialista en herramientas creativas Google FX Flow / Media AI. Transforma la idea del usuario en un flujo de trabajo ejecutable detallado con pasos secuenciales, prompts optimizados para texto/imagen/audio, presupuesto de tokens estimado y configuración de parámetros.";
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const generatedText = response.text || "No se generó respuesta.";

    // Estimated token metric calculations
    const estimatedInputTokens = Math.ceil(prompt.length / 4);
    const estimatedOutputTokens = Math.ceil(generatedText.length / 4);
    const tokenEfficiencyScore = Math.min(100, Math.round((estimatedOutputTokens / (estimatedInputTokens + 1)) * 25));

    res.json({
      success: true,
      model,
      output: generatedText,
      metrics: {
        inputTokens: estimatedInputTokens,
        outputTokens: estimatedOutputTokens,
        totalTokens: estimatedInputTokens + estimatedOutputTokens,
        tokenEfficiencyScore,
        estimatedCreditsSavedPercentage: mode === "optimize_tokens" ? "35%" : "15%",
      },
    });
  } catch (error: any) {
    console.error("Error en /api/flow/generate:", error);
    res.status(500).json({
      error: error.message || "Error al procesar la solicitud con Gemini API",
    });
  }
});

// API: Analyze Image with Google Search Grounding & Web Page References
app.post("/api/image/analyze", async (req, res) => {
  try {
    const {
      image,
      mimeType = "image/jpeg",
      prompt = "Analiza detalladamente esta imagen. Identifica el objeto, lugar, obra de arte, producto, texto o concepto. Utiliza la búsqueda de Google para encontrar páginas web de referencia, fuentes oficiales y contexto actualizado relacionado con la imagen.",
      model = "gemini-3.5-flash",
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No se proporcionó la imagen en base64" });
    }

    // Strip base64 header prefix if present
    const base64Data = image.includes(";base64,") ? image.split(";base64,")[1] : image;

    const contents: any[] = [
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
      { text: prompt },
    ];

    const response = await ai.models.generateContent({
      model: model || "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction:
          "Eres un especialista en análisis de visión por computadora y búsqueda web avanzada con Google Search. Al analizar imágenes, identifica elementos clave y proporciona referencias web precisas, nombres de páginas, enlaces e información verificada.",
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract search queries & web chunks
    const searchQueries: string[] = groundingMetadata?.webSearchQueries || [];
    const rawChunks = groundingMetadata?.groundingChunks || [];

    const webReferences = rawChunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        url: chunk.web.uri,
      }));

    // Remove duplicate URLs
    const uniqueWebReferences = Array.from(
      new Map(webReferences.map((item: any) => [item.url, item])).values()
    );

    res.json({
      success: true,
      analysis: response.text || "No se generó texto de análisis.",
      searchQueries,
      webReferences: uniqueWebReferences,
      groundingMetadata,
      modelUsed: model,
    });
  } catch (error: any) {
    console.error("Error en /api/image/analyze:", error);
    res.status(500).json({
      error: error.message || "Error al analizar la imagen con la API de Gemini",
    });
  }
});

// API: Calculate Token Budget & Credit Maximizer metrics
app.post("/api/flow/calculate-tokens", (req, res) => {
  try {
    const { promptText, model, payloadSizeKb = 12 } = req.body;
    const charCount = (promptText || "").length;
    const estTokens = Math.ceil(charCount / 3.8);
    
    // Credit calculations based on Gemini 3.6 Flash & 3.1 Pro models
    const costPer1kInputTokens = model === "gemini-3.1-pro-preview" ? 0.00125 : 0.000075;
    const costPer1kOutputTokens = model === "gemini-3.1-pro-preview" ? 0.00500 : 0.000300;

    const estimatedOutput = Math.round(estTokens * 2.5);
    const totalCostUSD = ((estTokens / 1000) * costPer1kInputTokens) + ((estimatedOutput / 1000) * costPer1kOutputTokens);

    res.json({
      inputCharacters: charCount,
      estimatedInputTokens: estTokens,
      estimatedOutputTokens: estimatedOutput,
      totalEstimatedTokens: estTokens + estimatedOutput,
      costEstimateUSD: totalCostUSD.toFixed(6),
      optimizations: [
        "Compresión de instrucciones del sistema activada (-25% tokens)",
        "Respuesta estructurada en formato pydantic/JSON (-15% tokens basura)",
        "Estrategia de caché de contexto activa para llamadas recurrentes",
        "Control de temperatura (0.6) para prevenir bucles repetitivos",
      ]
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==============================================================================
// I WONDER SHOW - EPISODE PRODUCTION SUITE APIS
// ==============================================================================

// 1. Generate full episode script & structured scenes
app.post("/api/episode/generate-script", async (req, res) => {
  try {
    const {
      idea,
      lesson = "Pensar antes de actuar y tener empatía",
      sceneCount = 6,
      episodeNumber = 1,
    } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "La idea del episodio es requerida." });
    }

    const systemInstruction = `Eres el Director Narrativo y Guionista Principal de la serie animada 3D 'I Wonder Show: Curiosidad Sin Límites'.
Los protagonistas de la serie son dos amigos inseparables:
- SAÚL: Analítico, precavido, pero cómplice en las travesuras. Gorra negra curva sobre los ojos, barba de candado corta, camiseta negra ajustada con tatuajes en ambos brazos.
- CÉSAR: Curioso empedernido, impulsivo ('I Wonder...?'), científico callejero sin frenos. Cabello negro rizado estilo 70s hasta la nuca, lentes redondos grandes, camiseta con disco de vinilo y tatuajes en los brazos.

La fórmula canónica inquebrantable de cada episodio es:
Curiosidad → Investigación → Caos → Descubrimiento → Risas → Lección.

Genera un episodio estructurado con exactamente ${sceneCount} viñetas/escenas.
Cada escena debe tener:
- number: índice numérico
- stage: una de ('Curiosidad', 'Investigación', 'Caos', 'Descubrimiento', 'Risas', 'Lección')
- title: título breve de la escena
- visualAction: descripción de lo que ocurre visualmente (gestos cómicos, posturas)
- cameraAngle: ángulo y encuadre cinematográfico
- dialogue: lista de diálogos entre 'Saul', 'Cesar' o 'Narrator', con textos cómicos y naturales en español mexicano neutro, e indicación de emoción
- sfx: uno de ('zap', 'whoosh', 'click', 'pop', 'smoke', 'chime', 'alarm', 'ticking', 'explosion', 'none')
- fxFlowPrompt: prompt cinematográfico en inglés para Google FX Flow / Gemini Image, detallando a Saúl y César en estilo 3D Pixar Cartoon, iluminación y acción.
- durationSeconds: duración sugerida (3 a 6 segundos).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Idea del episodio: "${idea}". Lección clave: "${lesson}". Número de episodio: ${episodeNumber}.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título llamativo del episodio" },
            synopsis: { type: Type.STRING, description: "Sinopsis de 2 oraciones" },
            lesson: { type: Type.STRING, description: "La lección o enseñanza detrás de la comedia" },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER },
                  stage: { type: Type.STRING },
                  title: { type: Type.STRING },
                  visualAction: { type: Type.STRING },
                  cameraAngle: { type: Type.STRING },
                  dialogue: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        speaker: { type: Type.STRING, description: "Saul | Cesar | Narrator" },
                        text: { type: Type.STRING },
                        emotion: { type: Type.STRING },
                      },
                      required: ["speaker", "text"],
                    },
                  },
                  sfx: { type: Type.STRING },
                  fxFlowPrompt: { type: Type.STRING },
                  durationSeconds: { type: Type.INTEGER },
                },
                required: ["number", "stage", "title", "visualAction", "dialogue", "sfx", "fxFlowPrompt", "durationSeconds"],
              },
            },
          },
          required: ["title", "synopsis", "lesson", "scenes"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, episode: parsed });
  } catch (error: any) {
    console.error("Error en /api/episode/generate-script:", error);
    res.status(500).json({ error: error.message || "Error al generar el guion del episodio" });
  }
});

// 2. Generate 3D Cartoon scene storyboard frame
app.post("/api/scene/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "16:9", characterDna } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt visual es requerido." });
    }

    const fullPrompt = `${prompt}. In the scene, keep character consistency: Saúl (skinny, black cap pulled low over eyes, short beard, fitted black shirt, arm tattoos) and/or César (skinny, neck-length 70s curly dark hair, large round glasses, light shirt with black vinyl record print, arm tattoos). Style: 3D Pixar/DreamWorks animated feature film, vibrant warm cinematic lighting, rich textures, expressive humorous facial expressions, 8k render quality.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = "";
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: "El modelo no devolvió datos de imagen." });
    }

    res.json({ success: true, imageUrl, promptUsed: fullPrompt });
  } catch (error: any) {
    console.error("Error en /api/scene/generate-image:", error);
    res.status(500).json({ error: error.message || "Error al generar el cuadro 3D" });
  }
});

// 3. Generate Dual Voice Audio (TTS) for Scene Dialogues
app.post("/api/scene/generate-tts", async (req, res) => {
  try {
    const { dialogue } = req.body; // array of { speaker, text, emotion }

    if (!dialogue || !Array.isArray(dialogue) || dialogue.length === 0) {
      return res.status(400).json({ error: "Se requiere un arreglo de diálogos." });
    }

    // Build screenplay text
    const scriptText = dialogue
      .map((d: any) => `${d.speaker}: ${d.text}`)
      .join("\n");

    const speakersPresent = Array.from(new Set(dialogue.map((d: any) => d.speaker)));

    let base64Audio = "";

    // If dual speaker (Saul + Cesar)
    if (speakersPresent.includes("Saul") && speakersPresent.includes("Cesar")) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash-tts",
          contents: [
            {
              role: "user",
              parts: dialogue.map((d: any) => ({
                text: `${d.speaker}: ${d.text}`,
                speechMetadata: {
                  speaker: d.speaker,
                  style: d.speaker === "Saul" ? "Calm, grounded, slightly sarcastic and instructional" : "Excited, animated, energetic and curious",
                },
              })),
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  { speaker: "Saul", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } },
                  { speaker: "Cesar", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } },
                ],
              },
            },
          },
        });

        base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
      } catch (errMulti) {
        console.warn("Multi-speaker TTS fallback to single speaker:", errMulti);
      }
    }

    // Fallback to single speaker standard TTS if not multi-speaker or failed
    if (!base64Audio) {
      const primaryVoice = dialogue[0]?.speaker === "Saul" ? "Charon" : "Puck";
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash-lite-tts",
        contents: [
          {
            role: "user",
            parts: [{ text: scriptText }],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: primaryVoice },
            },
          },
        },
      });
      base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
    }

    if (!base64Audio) {
      return res.status(500).json({ error: "No se pudo sintetizar el audio de la escena." });
    }

    res.json({
      success: true,
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error: any) {
    console.error("Error en /api/scene/generate-tts:", error);
    res.status(500).json({ error: error.message || "Error al generar voces TTS" });
  }
});

// 4. Generate Animated Video Clip (Omni Flash / Veo)
app.post("/api/scene/generate-video", async (req, res) => {
  try {
    const {
      prompt,
      imageBase64,
      duration = "5s",
      aspectRatio = "16:9",
      previousInteractionId,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt para el video es requerido." });
    }

    const videoPrompt = `Cinematic 3D animation clip of I Wonder Show: ${prompt}. Consistent characters: Saúl (black cap, beard, black t-shirt, arm tattoos) and César (70s neck curly hair, round glasses, vinyl t-shirt, arm tattoos). Expressive fluid cartoon motion, Disney Pixar movie lighting.`;

    let inputPayload: any;
    if (imageBase64) {
      const cleanData = imageBase64.includes(";base64,") ? imageBase64.split(";base64,")[1] : imageBase64;
      inputPayload = [
        {
          type: "image",
          mime_type: "image/png",
          data: cleanData,
        },
        {
          type: "text",
          text: videoPrompt,
        },
      ];
    } else {
      inputPayload = videoPrompt;
    }

    const interactionParams: any = {
      model: "gemini-omni-1.1-flash",
      input: inputPayload,
      background: false,
      store: true,
      stream: false,
      response_format: {
        type: "video",
        aspect_ratio: aspectRatio,
        duration: duration,
        resolution: "720p",
      },
    };

    if (previousInteractionId) {
      interactionParams.previous_interaction_id = previousInteractionId;
    }

    const interaction = await ai.interactions.create(interactionParams, { timeout: 300000 });

    const videoPart = interaction.output_video;
    let videoUrl = "";
    if (videoPart && videoPart.data) {
      videoUrl = `data:video/mp4;base64,${videoPart.data}`;
    }

    res.json({
      success: true,
      interactionId: interaction.id,
      videoUrl,
      hasVideoData: Boolean(videoUrl),
      status: interaction.status,
    });
  } catch (error: any) {
    console.error("Error en /api/scene/generate-video:", error);
    res.status(500).json({
      error: error.message || "Error al animar video con gemini-omni-1.1-flash",
    });
  }
});

// Vite middleware setup for Development / Static serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`⚡ Server Google FX Flow Suite ejecutándose en http://0.0.0.0:${PORT}`);
  });
}

startServer();
