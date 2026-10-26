# VoiceDirector — Consola de Dirección de Voces y SFX para AnimaticTheater

Integración de un panel lateral de dirección vocal y acústica (**VoiceDirector**) dentro del **AnimaticTheater**, que permite al creador dirigir escena por escena las actuaciones vocales de **Saúl** y **César**, alternar entre voces oficiales de Gemini (`Charon`, `Puck`, `Fenrir`, `Zephyr`), modular el tono (*pitch*), la velocidad de articulación y los estilos interpretativos (calmado/sarcástico, exaltado/curioso, pánico, susurro), sincronizar efectos de sonido de cómic (*ZZZAAPPPP!*, *WHOOSH!*, *POP!*, *CLICK!*, *SMOKE!*) y regenerar o previsualizar el audio resultante en vivo.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones confirmadas por el usuario en la Fase 1:**
> - **Ubicación en Pantalla**: Panel lateral retráctil / desplegable acoplado directamente al lado derecho de la pantalla de reproducción del `AnimaticTheater`, manteniendo visible el cuadro de video o storyboard mientras se ajustan las voces.
> - **Controles de Actuación**:
>   - Selector de voces Gemini para cada personaje: Saúl (por defecto `Charon`, opciones `Fenrir`, `Zephyr`) y César (por defecto `Puck`, opciones `Kore`, `Zephyr`).
>   - Controles de tono musical / pitch y velocidad de articulación (0.75x a 1.5x) procesados en tiempo real mediante Web Audio API / Gemini TTS.
>   - Selector de estilo expresivo de actuación: *Calmado & Sarcástico*, *Exaltado & Curioso*, *Pánico Cómico*, *Susurro Conspirativo* o *Solemne/Narrador*.
> - **Gestión de Efectos de Sonido (SFX)**:
>   - Secuenciador sincronizado con el diálogo (disparo automático en el momento exacto de la viñeta) más teclado/pad de botones de prueba manual interactiva con sonido procedural instantáneo.
> - **Edición de Diálogos Escena por Escena**: Posibilidad de ajustar los textos de Saúl y César directamente desde el VoiceDirector y presionar "Regenerar Audio de Escena" con Gemini TTS.

---

## 1. Overview & Core Concept

- **Qué Hace**: Convierte el reproductor de animatics en una cabina de dirección de doblaje y diseño sonoro profesional para animación. El usuario puede seleccionar cualquier escena del episodio, escuchar los diálogos individuales de Saúl y César, probar distintas voces y tonos, cambiar la emoción interpretativa, agregar o cambiar efectos de sonido (*SFX*) y escuchar la mezcla final sincronizada al instante.
- **Audiencia y Propósito**: Creadores y animadores de *I Wonder Show* que necesitan afinar el timing cómico de los gags (como el contraste entre la calma de Saúl y la histeria electrificada de César).
- **Valor Principal**: Ya no es necesario regresar a la fábrica de escenas para probar cómo suena un diálogo; la dirección vocal ocurre en el mismo entorno de reproducción cinematográfica con retroalimentación inmediata.

---

## 2. User Experience & Visual Design

### Arquitectura de Interfaz & Flujo de Usuario
1. **Acceso al VoiceDirector**:
   - En la barra de controles de `AnimaticTheater`, se añade el botón **"Director de Voces (VoiceDirector)"** con icono de ecualizador/micrófono y estado activo luminoso.
   - Al pulsarlo, el lienzo de video se reajusta suavemente y se despliega un panel lateral de 380px con estética de consola de estudio de sonido nocturno.
2. **Pestañas Internas del VoiceDirector**:
   - **Pestaña 1: Saúl**:
     - Avatar con gorra negra y rasgos canónicos.
     - Selector de voz: `Charon` (Canónica grave/calmada), `Fenrir` (Grave profunda), `Zephyr` (Equilibrada).
     - Control deslizante de Tono / Pitch (-6 a +6 semitonos).
     - Control de Velocidad de habla (0.75x a 1.35x).
     - Preset de Emoción: *Calmado/Sarcástico*, *Advertencia Firme*, *Cómplice*, *Decepción Cómica*.
     - Diálogo editable de Saúl para la escena activa con botón "Probar Línea".
   - **Pestaña 2: César**:
     - Avatar con rizos de los 70s y lentes redondos.
     - Selector de voz: `Puck` (Canónica energética/aguda), `Kore` (Expresiva rápida), `Zephyr`.
     - Control de Tono / Pitch y Velocidad (hasta 1.4x para momentos de aceleración cómica).
     - Preset de Emoción: *Fascinado (I Wonder?)*, *Exaltado/Hiperactivo*, *Electrificado/Aturdido*, *Pánico*.
     - Diálogo editable de César para la escena activa con botón "Probar Línea".
   - **Pestaña 3: Efectos de Sonido (SFX Master)**:
     - Asignación del efecto principal de la escena (*ZZZAAPPPP!*, *WHOOSH!*, *POP!*, *CLICK!*, *SMOKE SSSSSS...*, *EXPLOSION!*, *CHIME*).
     - Pad interactivo de botones con disparo de audio Web Audio instantáneo para probar el efecto al vuelo.
     - Volumen y ganancia del efecto frente a las voces.
3. **Acciones Rápidas del Director**:
   - Botón destacado: **"Sintetizar Audio de Escena con Gemini TTS"** (llama a la API del servidor y reemplaza la pista de la escena activa).
   - Botón: **"Previsualizar Escena Completa"** (reproduce cuadro visual + diálogo dual + SFX sincronizado).

### Estilo Visual y Paleta (Regla 60-30-10)
- **60% Fondo de Cabina de Grabación**: Pizarra ultra oscura (`#090D16`) que evoca una consola de postproducción de audio.
- **30% Módulos y Faders**: Superficies de canal en gris espacial (`#0F172A`) con líneas de separación milimétricas (`#1E293B`) y números tabulares mono (`tabular-nums font-mono`).
- **10% Indicadores VUMeter & Acentos**: Cian eléctrico (`#0EA5E9`) para los canales de Saúl, Ámbar cálido (`#F59E0B`) para los canales de César y Verde Neón suave (`#10B981`) para el botón de síntesis activa.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Panel Lateral Desplegable vs. Modal Flotante**
  - *Enfoque Elegido*: Panel lateral acoplado en flex layout (`w-96` en desktop, responsive en mobile).
  - *Por qué*: El usuario confirmó en Phase 1 que prefiere tener la pantalla de video o imagen siempre a la vista para verificar la sincronía gestual con el audio.
- **Decisión 2: Previsualización Inmediata con Web Audio API + Síntesis Alta Fidelidad con Gemini TTS**
  - *Enfoque Elegido*: Para cambios rápidos de pitch y velocidad, el reproductor puede modular el buffer de audio en el navegador con Web Audio API `AudioContext.playbackRate` y nodos de ganancia; al dar clic en "Sintetizar con Gemini", se envía la instrucción de voz y metadatos (`speechMetadata: { style }`) al modelo `gemini-3.8-flash-tts` para generar el WAV definitivo con acting real.
  - *Por qué*: Ofrece retroalimentación instantánea sin latencia, al mismo tiempo que produce audios finales con calidad cinematográfica.
- **Decisión 3: Persistencia de Ajustes en el Estado del Episodio**
  - *Enfoque Elegido*: Los ajustes de voz seleccionados (nombre de voz, estilo, cambios en diálogos y SFX) se guardan directamente en el objeto de la escena y se conservan al exportar el paquete de producción o el ZIP para laptop.

---

## 4. Technical Architecture & Data Strategy

### Diagrama de Flujo e Integración

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ANIMATIC THEATER                               │
├────────────────────────────────────────┬────────────────────────────────────┤
│         LIENZO DE VIDEO / STORYBOARD   │       PANEL VOICEDIRECTOR          │
│                                        │  ┌──────────────────────────────┐  │
│  - Video MP4 / Imagen Ken Burns        │  │ [Saúl]   [César]   [SFX Pad] │  │
│  - Subtítulos dinámicos de cómic       │  ├──────────────────────────────┤  │
│  - Indicador de SFX flotante           │  │ Voz: Charon / Puck / Zephyr  │  │
│  - Controles de reproducción           │  │ Sliders: Pitch (-6..+6),     │  │
│                                        │  │          Speed (0.75..1.5x)  │  │
│                                        │  │ Estilo: Calmado / Exaltado   │  │
│                                        │  │ Diálogo editable             │  │
│                                        │  ├──────────────────────────────┤  │
│                                        │  │ [🎙️ Sintetizar con Gemini]    │  │
│                                        │  │ [▶️ Probar Mezcla Local]     │  │
│                                        │  └──────────────────────────────┘  │
└────────────────────────────────────────┴────────────────────────────────────┘
                                   │
                                   ▼
         ┌──────────────────────────────────────────────────┐
         │     POST /api/scene/generate-tts (server.ts)     │
         │     - multiSpeakerVoiceConfig: Saúl & César      │
         │     - speechMetadata: style & emotion            │
         │     - Salida: audio/wav (24kHz Mono 16-bit)      │
         └──────────────────────────────────────────────────┘
```

### Rutas del Servidor Actualizadas
- `POST /api/scene/generate-tts`:
  - Recibe el arreglo de diálogos enriquecido con parámetros de director: `{ dialogue: [{ speaker, text, emotion, voiceName, speechStyle }] }`.
  - Configura dinámicamente `speakerVoiceConfigs` en `gemini-3.8-flash-tts` según la voz elegida para Saúl (`Charon`, `Fenrir`, `Zephyr`) y César (`Puck`, `Kore`, `Zephyr`).
  - Devuelve el audio WAV base64 actualizado.

### Archivos Nuevos y Modificados
- `src/components/VoiceDirector.tsx` *(Nuevo)*: Componente completo de consola de doblaje y SFX con faders, selectores de voz, pads de efectos sonoros y pruebas de línea.
- `src/components/AnimaticTheater.tsx`: Integración del botón de apertura, layout split con el canvas de video, sincronización bidireccional de diálogos y reproducción con modulación de velocidad y tono.
- `src/server.ts`: Soporte en `/api/scene/generate-tts` para mapear las voces seleccionadas por el usuario en cada línea de diálogo.
