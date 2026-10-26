export interface BundleConfig {
  projectName: string;
  version: string;
  author: string;
  description: string;
  pythonVersion: string;
  jwtSecret: string;
  jwtExpirationMinutes: number;
  encryptionKey: string;
  geminiModel: string;
  logLevel: "DEBUG" | "INFO" | "WARNING" | "ERROR";
  tokenBudgetMax: number;
  enableTokenOptimization: boolean;
  enableDocker: boolean;
  enableKubernetes: boolean;
  k8sNamespace: string;
  k8sReplicas: number;
  port: number;
  customEnvVars: Array<{ key: string; value: string; comment: string }>;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: "python" | "bash" | "dockerfile" | "yaml" | "json" | "markdown" | "plaintext";
  description: string;
  category: "script" | "config" | "security" | "deploy" | "docs" | "test";
}

export interface FlowNode {
  id: string;
  name: string;
  type: "text_prompt" | "prompt_refiner" | "image_gen" | "jwt_validator" | "crypto_vault" | "token_optimizer";
  model: string;
  systemPrompt: string;
  userPrompt: string;
  tokensEstimate: number;
  status?: "idle" | "running" | "completed" | "error";
  output?: string;
}

export interface WebReference {
  title: string;
  url: string;
  snippet?: string;
}

export interface ImageAnalysisResult {
  analysisText: string;
  searchQueries: string[];
  webReferences: WebReference[];
  modelUsed: string;
  timestamp: string;
  imageUrl?: string;
  imageFileName?: string;
  imageSizeKb?: number;
}

export interface TokenMetrics {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  efficiencyScore: number;
  estimatedCreditsSavedPercentage: string;
  costUSD: string;
}

// ==============================================================================
// I WONDER SHOW - CARTOON UNIVERSE TYPES
// ==============================================================================

export type ShowSpeaker = "Saul" | "Cesar" | "Narrator";

export type SoundEffectType =
  | "zap"
  | "whoosh"
  | "click"
  | "pop"
  | "smoke"
  | "chime"
  | "alarm"
  | "ticking"
  | "explosion"
  | "none";

export interface DialogueLine {
  id?: string;
  speaker: ShowSpeaker;
  text: string;
  emotion?: string;
  actionNote?: string;
}

export type EpisodeFormulaStage =
  | "Curiosidad"
  | "Investigación"
  | "Caos"
  | "Descubrimiento"
  | "Risas"
  | "Lección";

export interface SceneItem {
  id: string;
  number: number;
  stage: EpisodeFormulaStage;
  title: string;
  visualAction: string;
  cameraAngle: string;
  dialogue: DialogueLine[];
  sfx: SoundEffectType;
  fxFlowPrompt: string;
  durationSeconds: number;
  imageUrl?: string;
  isGeneratingImage?: boolean;
  audioWavUrl?: string;
  isGeneratingAudio?: boolean;
  videoUrl?: string;
  isGeneratingVideo?: boolean;
  interactionId?: string;
}

export interface CharacterProfile {
  id: "saul" | "cesar";
  name: string;
  title: string;
  role: string;
  voiceName: "Charon" | "Puck" | "Fenrir" | "Kore";
  voiceStyle: string;
  visualTraits: string[];
  personality: string[];
  quote: string;
  avatarRef: string;
  promptDNA: string;
}

export interface EpisodeTemplate {
  id: string;
  episodeNumber: number;
  title: string;
  lesson: string;
  synopsis: string;
  tagline: string;
  sheetSource?: string;
  scenes: Omit<SceneItem, "id" | "imageUrl" | "audioWavUrl" | "videoUrl" | "isGeneratingImage" | "isGeneratingAudio" | "isGeneratingVideo">[];
}

export interface EpisodeProject {
  id: string;
  title: string;
  episodeNumber: number;
  synopsis: string;
  lesson: string;
  corePrinciple: "Curiosity → Investigation → Chaos → Discovery → Laugh → I Wonder Show";
  scenes: SceneItem[];
  createdAt: string;
  aspectRatio: "16:9" | "9:16";
}

