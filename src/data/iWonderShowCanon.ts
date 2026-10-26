import { CharacterProfile, EpisodeTemplate } from "../types";

export const SHOW_ASSETS = {
  POSTER_ART: "/public/assets/aistudio/IMG-20261025-WA0027_7a951d56.jpg",
  CONCEPT_BIBLE: "/public/assets/aistudio/IMG-20261025-WA0026_2713e698.jpg",
  COMIC_UNPLUG_FIRST: "/public/assets/aistudio/IMG-20261025-WA0025_55dd8b3f.jpg",
  COMIC_ADHESIVE_EXPERIMENT: "/public/assets/aistudio/IMG-20261025-WA0028_eaf35ba6.jpg",
};

export const CHARACTERS: Record<"saul" | "cesar", CharacterProfile> = {
  saul: {
    id: "saul",
    name: "Saúl",
    title: "El Estratega Previsor",
    role: "Analítico, cauteloso pero con el mismo espíritu cómplice y travieso",
    voiceName: "Charon", // Warm, grounded, slightly sarcastic & calm tone
    voiceStyle: "Tono mexicano neutral, ligeramente grave, voz tranquila y sarcástica con remates cómicos rápidos",
    visualTraits: [
      "Complexión delgada (skinny), misma estatura que César",
      "Gorra negra de béisbol ligeramente inclinada sobre los ojos",
      "Barba de candado corta y orejas ligeramente grandes",
      "Camiseta negra ajustada y tatuajes detallados en ambos brazos",
      "Pantalones de mezclilla oscuros y tenis estilo skater",
    ],
    personality: [
      "Prudente y precavido ('Lo primero es desconectarla')",
      "Tiene razón el 50% de las veces, pero también cae en el caos",
      "Hermano/compañero cómplice y paciente con las locuras de César",
    ],
    quote: "Esto es exactamente por lo que se desconecta el aparato ANTES de empezar a desarmarlo.",
    avatarRef: "/public/assets/aistudio/IMG-20261025-WA0026_2713e698.jpg",
    promptDNA:
      "Saúl from I Wonder Show: 3D Pixar/DreamWorks style cartoon character, skinny build, wearing a black curved-brim baseball cap pulled over his eyes, short goatee beard, slightly larger expressive ears, full sleeve tattoos on both arms, fitted black t-shirt, dark jeans, warm cinematic workshop lighting, highly expressive animated face.",
  },
  cesar: {
    id: "cesar",
    name: "César",
    title: "El Científico Impulsivo",
    role: "Curioso sin límites, obsesivo con los misterios y de gatillo fácil",
    voiceName: "Puck", // Energetic, curious, fast-paced, high pitched
    voiceStyle: "Tono entusiasta, rápido, voz juvenil con risillas de emoción (<laugh>) e interjecciones de asombro (<gasp>)",
    visualTraits: [
      "Complexión delgada (skinny), misma estatura que Saúl",
      "Cabello negro rizado y despeinado estilo años 70 hasta la nuca",
      "Lentes redondos grandes y negros con ojos saltones muy expresivos",
      "Camiseta gris clara con estampado de disco de vinilo en el pecho",
      "Tatuajes artísticos en los brazos y tenis Converse clásicos",
    ],
    personality: [
      "Impulsivo, guiado por la curiosidad pura ('I Wonder...?')",
      "No lee las instrucciones ni espera las advertencias",
      "Optimista empedernido: cada desastre es una nueva oportunidad para investigar",
    ],
    quote: "¡Órale Saúl! ¡Vamos a arreglar esta tele! I WONDER...?",
    avatarRef: "/public/assets/aistudio/IMG-20261025-WA0026_2713e698.jpg",
    promptDNA:
      "César from I Wonder Show: 3D Pixar/DreamWorks style cartoon character, skinny build, 1970s neck-length wild curly black hair, oversized round glasses, huge curious wide eyes, light grey t-shirt with a vintage black vinyl record graphic print, tattoos on arms, blue jeans, sneakers, frantic energetic posture, warm vibrant studio lighting.",
  },
};

export const CANON_EPISODES: EpisodeTemplate[] = [
  {
    id: "ep-01-unplug-first",
    episodeNumber: 1,
    title: "¡Desconecta Primero!",
    lesson: "Seguridad y Pensar Antes de Actuar",
    tagline: "El día que César descubrió el poder de 220 voltios.",
    synopsis:
      "Saúl y César deciden reparar una televisión vintage en su taller. Antes de que Saúl termine de advertir la regla número uno, César mete el destornillador y desata una descarga cómica que electrifica el estudio.",
    sheetSource: SHOW_ASSETS.COMIC_UNPLUG_FIRST,
    scenes: [
      {
        number: 1,
        stage: "Curiosidad",
        title: "El Diagnóstico de la Tele",
        visualAction:
          "César y Saúl se inclinan sobre una mesa de taller repleta de herramientas mirando una televisión antigua de tubo catódico.",
        cameraAngle: "Plano medio frontal con iluminación cálida de lámpara de taller.",
        dialogue: [
          { speaker: "Cesar", text: "¡Órale Saúl! ¡Vamos a arreglar esta tele!", emotion: "Emocionado" },
          { speaker: "Saul", text: "Va pues... a ver qué tiene. Pero el paso número uno es muy importante...", emotion: "Cauteloso" },
        ],
        sfx: "click",
        fxFlowPrompt:
          "3D animation shot: César with curly 70s hair and round glasses and Saúl in a black cap and tattoos standing by an old vintage CRT television in a cozy dimly lit cluttered electronics workshop, analyzing the device, warm rim light, Pixar aesthetic.",
        durationSeconds: 4,
      },
      {
        number: 2,
        stage: "Investigación",
        title: "La Regla de Oro",
        visualAction:
          "Saúl señala fijamente con el dedo índice el enchufe de la pared conectado, con cara de maestro precavido.",
        cameraAngle: "Primer plano a la mano de Saúl y al contacto eléctrico.",
        dialogue: [
          { speaker: "Saul", text: "OK César... LO PRIMERO ES DESCONECTARLA. Siempre se desconecta antes de empezar.", emotion: "Enfático" },
        ],
        sfx: "none",
        fxFlowPrompt:
          "Close up 3D cartoon shot: Saúl pointing with emphasis at an old electrical wall plug inserted into a socket, instructional red underline graphic glow, cartoon depth of field.",
        durationSeconds: 3,
      },
      {
        number: 3,
        stage: "Investigación",
        title: "¿I Wonder...?",
        visualAction:
          "César no escucha y mete con una sonrisa traviesa un destornillador rojo dentro de los circuitos abiertos del televisor. Saúl en el fondo entra en pánico.",
        cameraAngle: "Plano holandés dinámico con foco en la punta del destornillador.",
        dialogue: [
          { speaker: "Cesar", text: "I WONDER...?", emotion: "Fascinado y susurrando" },
          { speaker: "Saul", text: "¡ESPERA CÉSAR! ¡Todavía está conectada!", emotion: "Gritando aterrado" },
        ],
        sfx: "ticking",
        fxFlowPrompt:
          "3D cartoon frame: César smiling mischievous with round glasses about to poke a metal screwdriver into a live electronic chassis, neon 'I WONDER ?' glowing in the air, while Saúl in background panics waving arms, cinematic drama.",
        durationSeconds: 3,
      },
      {
        number: 4,
        stage: "Caos",
        title: "¡¡ZZZAAPPPP!!",
        visualAction:
          "Una descomunal descarga eléctrica de rayos azules ilumina la habitación. César vuela hacia atrás con el cabello encrespado y los ojos saltones.",
        cameraAngle: "Plano general de choque con destellos de relámpago azul y letras en cómic.",
        dialogue: [
          { speaker: "Cesar", text: "¡¡¡ZZZZAAAAPPPP!!!", emotion: "Electrificado" },
          { speaker: "Saul", text: "¡¡NOOO!!", emotion: "Grito de susto" },
        ],
        sfx: "zap",
        fxFlowPrompt:
          "High octane 3D cartoon action shot: explosive blue electric lightning arcs erupting from inside the TV, shocking César whose curly hair turns into a giant spiked afro, mouth wide open screaming, dynamic comic burst 'ZZZAAPPPP!'.",
        durationSeconds: 4,
      },
      {
        number: 5,
        stage: "Descubrimiento",
        title: "Humo y Cenizas",
        visualAction:
          "César está completamente chamuscado, con columnas de humo blanco saliendo de su cabeza y la lengua de fuera. Saúl lo mira con los brazos cruzados.",
        cameraAngle: "Plano medio a los dos personajes con estelas de humo ondulantes.",
        dialogue: [
          { speaker: "Cesar", text: "<breath> Ssssss...", emotion: "Aturdido" },
        ],
        sfx: "smoke",
        fxFlowPrompt:
          "Hilarious 3D animation post-explosion scene: César standing dazed, charred black face, tongue sticking out, curly hair smoking with thick cartoon smoke trails rising, Saúl with crossed arms shaking his head, comedy timing.",
        durationSeconds: 4,
      },
      {
        number: 6,
        stage: "Risas",
        title: "Te Lo Dije",
        visualAction:
          "Saúl levanta un dedo en tono de lección obvia mientras César gime atontado con pajaritos o estrellas girando sobre su cabeza.",
        cameraAngle: "Plano medio cerrado con expresión divertida de Saúl.",
        dialogue: [
          { speaker: "Cesar", text: "Uuughh...", emotion: "Mareado" },
          { speaker: "Saul", text: "OK... ESTO ES EXACTAMENTE POR LO QUE SE DESCONECTA EL APARATO ANTES DE EMPEZAR A DESARMARLO.", emotion: "Irónico" },
        ],
        sfx: "pop",
        fxFlowPrompt:
          "3D animated cartoon: Saúl with a knowing smirk and finger raised lecturing, while César still charred blinks disoriented with yellow cartoon dizzy stars, warm workshop background.",
        durationSeconds: 4,
      },
      {
        number: 7,
        stage: "Lección",
        title: "Las Grandes Preguntas",
        visualAction:
          "Pantalla con atmósfera nocturna estrellada y texto manuscrito brillante sobre las preguntas que mueven al mundo.",
        cameraAngle: "Fondo cósmico oscuro con estrellas titilantes.",
        dialogue: [
          { speaker: "Narrator", text: "...y así es como comienzan las grandes preguntas...", emotion: "Narrador épico" },
        ],
        sfx: "chime",
        fxFlowPrompt:
          "Cinematic dark starry night background with elegant warm script lettering '...y así es como comienzan las grandes preguntas...', glowing dust particles, soft depth of field.",
        durationSeconds: 3,
      },
      {
        number: 8,
        stage: "Lección",
        title: "Cierre: I Wonder Show?",
        visualAction:
          "Saúl y César limpios y sonrientes posan de espaldas uno contra otro con el gran logotipo tridimensional de I WONDER SHOW brillante.",
        cameraAngle: "Plano héroe centrado con logotipo volumétrico iluminado.",
        dialogue: [
          { speaker: "Saul", text: "¡Curiosidad sin límites!", emotion: "Orgulloso" },
          { speaker: "Cesar", text: "¡I Wonder Show!", emotion: "Celebrando" },
        ],
        sfx: "chime",
        fxFlowPrompt:
          "Official 3D title card render: Saúl in black cap and César with round glasses smiling back-to-back under a massive glowing vibrant 3D text logo 'I WONDER SHOW? CURIOSIDAD SIN LÍMITES', dynamic comic burst, Pixar quality render.",
        durationSeconds: 4,
      },
    ],
  },
  {
    id: "ep-02-intro-curiosity-builds",
    episodeNumber: 0,
    title: "Intro Oficial: La Chispa de la Curiosidad",
    lesson: "Observar y no dejar de hacer preguntas",
    tagline: "Secuencia introductoria de 25 segundos para cada episodio de la serie.",
    synopsis:
      "César va investigando cada rincón cotidiano: bajo una roca, debajo de un papel, bajo un auto, hasta que descubre a Saúl señalando hacia el misterio del día.",
    sheetSource: SHOW_ASSETS.CONCEPT_BIBLE,
    scenes: [
      {
        number: 1,
        stage: "Curiosidad",
        title: "1. César Investiga con Lupa",
        visualAction: "César agachado en un camino empedrado examina una roca con una lupa enorme.",
        cameraAngle: "Plano entero lateral.",
        dialogue: [{ speaker: "Cesar", text: "¿Qué habrá aquí abajo?", emotion: "Intrigado" }],
        sfx: "whoosh",
        fxFlowPrompt: "3D animation: César crouching with big magnifying glass inspecting a stone in a picturesque village path, bright daylight, Pixar style.",
        durationSeconds: 3,
      },
      {
        number: 2,
        stage: "Curiosidad",
        title: "2. Mirando Bajo el Papel",
        visualAction: "César levanta una hoja de periódico abandonada en el suelo y asoma la cabeza.",
        cameraAngle: "Plano picado.",
        dialogue: [{ speaker: "Cesar", text: "Tampoco aquí...", emotion: "Buscando" }],
        sfx: "whoosh",
        fxFlowPrompt: "3D cartoon: César lifting a newspaper on the pavement, peering underneath with wide curious eyes.",
        durationSeconds: 3,
      },
      {
        number: 3,
        stage: "Investigación",
        title: "3. Debajo del Auto",
        visualAction: "César se agacha casi al ras del suelo mirando los engranes y neumáticos de un coche.",
        cameraAngle: "Plano rasante.",
        dialogue: [{ speaker: "Cesar", text: "¿Y aquí adentro?", emotion: "Susurrando" }],
        sfx: "click",
        fxFlowPrompt: "3D animation low angle: César peeking under the bumper of a vintage parked car, curious expression.",
        durationSeconds: 3,
      },
      {
        number: 4,
        stage: "Descubrimiento",
        title: "4. Saúl Aparece",
        visualAction: "César se levanta y se topa con Saúl sonriente, cruzado de brazos y con la gorra negra.",
        cameraAngle: "Plano conjunto a dos personajes.",
        dialogue: [{ speaker: "Saul", text: "¿Buscando algo, César?", emotion: "Divertido" }],
        sfx: "none",
        fxFlowPrompt: "3D cartoon: Saúl with black cap over eyes smiling with crossed arms standing in front of César who looks surprised.",
        durationSeconds: 3,
      },
      {
        number: 5,
        stage: "Risas",
        title: "5. Hacia Dónde Mirar",
        visualAction: "Saúl señala hacia el horizonte; César abre los ojos fascinado y echa a correr hacia allá.",
        cameraAngle: "Plano general con fuga al horizonte.",
        dialogue: [
          { speaker: "Saul", text: "¡Mira allá arriba!", emotion: "Señalando" },
          { speaker: "Cesar", text: "¡¡VAMOOOOOS!!", emotion: "Gritando de alegría" },
        ],
        sfx: "whoosh",
        fxFlowPrompt: "3D dynamic animation: Saúl pointing to the horizon while César sprints forward eagerly, camera whipping.",
        durationSeconds: 4,
      },
      {
        number: 6,
        stage: "Lección",
        title: "6. Estalla el Logo I WONDER SHOW",
        visualAction: "Fondo estelar con luna llena; el logotipo de I WONDER SHOW se ilumina con chispas doradas.",
        cameraAngle: "Logo central cinemático.",
        dialogue: [{ speaker: "Narrator", text: "¡I WONDER SHOW! El show comienza...", emotion: "Épico" }],
        sfx: "chime",
        fxFlowPrompt: "Cinematic 3D title screen: I WONDER SHOW glowing against full moon and starry sky, spark particles, 4k render.",
        durationSeconds: 4,
      },
    ],
  },
  {
    id: "ep-03-adhesive-experiment",
    episodeNumber: 2,
    title: "El Día Que Todo Se Pegó",
    lesson: "Ciencia de Materiales y Soluciones Creativas",
    tagline: "Un experimento con super-adhesivo que congeló al pueblo entero.",
    synopsis:
      "Saúl y César encuentran una máquina sellada que dice 'Adhesive Experiment - NO ABRIR'. Un botón después, sus manos quedan pegadas a la mesa, a sus propios cuerpos y a todo el pueblo.",
    sheetSource: SHOW_ASSETS.COMIC_ADHESIVE_EXPERIMENT,
    scenes: [
      {
        number: 1,
        stage: "Curiosidad",
        title: "La Caja Prohibida",
        visualAction: "César sostiene una caja de madera que tiene una placa de hierro: 'NO ABRIR. PUEDE SER PELIGROSO'.",
        cameraAngle: "Plano medio centrado.",
        dialogue: [
          { speaker: "Cesar", text: "¿Qué será esto?", emotion: "Tentado" },
          { speaker: "Saul", text: "¡No!", emotion: "Tajante" },
        ],
        sfx: "none",
        fxFlowPrompt: "3D cartoon scene: César holding a wooden hazard box with metal plate 'NO ABRIR - PELIGROSO', Saúl behind warning him.",
        durationSeconds: 3,
      },
      {
        number: 2,
        stage: "Investigación",
        title: "El Dial del 100%",
        visualAction: "Dentro de la caja hay una máquina con dos bloques y una perilla que va del 1% al 100%. Saúl y César la miran.",
        cameraAngle: "Plano medio a la máquina mecánica.",
        dialogue: [
          { speaker: "Saul", text: "Probablemente no deberíamos tocarlo...", emotion: "Cauteloso" },
          { speaker: "Cesar", text: "Solo una probadita al 100%...", emotion: "Mano en la perilla" },
        ],
        sfx: "click",
        fxFlowPrompt: "3D animation: vintage brass machine with a large analog gauge marked from 1% to 100%, César's hand turning knob.",
        durationSeconds: 4,
      },
      {
        number: 3,
        stage: "Caos",
        title: "¡WHOOSH! Todo se Pega",
        visualAction: "Chispas rojas brotan de la máquina y un líquido transparente hiper-adhesivo estalla cubriéndolos por completo.",
        cameraAngle: "Plano medio con telarañas pegajosas estirándose entre Saúl y César.",
        dialogue: [
          { speaker: "Saul", text: "¡Estamos pegados!", emotion: "Atrapado" },
          { speaker: "Cesar", text: "¡Ya me di cuenta!", emotion: "Intentando jalar" },
        ],
        sfx: "zap",
        fxFlowPrompt: "3D comedic chaos shot: Saúl and César stuck together chest-to-back with sticky elastic webbing everywhere, funny strained expressions.",
        durationSeconds: 4,
      },
      {
        number: 4,
        stage: "Descubrimiento",
        title: "Agua, Jabón y Calor... ¡Nada Funciona!",
        visualAction: "Tres viñetas divididas probando agua (Tacha roja), jabón (Tacha roja) y calor con secadora (Tacha roja).",
        cameraAngle: "Montaje triple de laboratorio cómico.",
        dialogue: [
          { speaker: "Cesar", text: "¡El agua no le hace nada! ¡Ni el jabón!", emotion: "Desesperado" },
          { speaker: "Saul", text: "Según la etiqueta... ¡el frío endurece y quiebra el adhesivo!", emotion: "Leyendo papel" },
        ],
        sfx: "pop",
        fxFlowPrompt: "Split screen 3D cartoon experiments: testing water bottle, soap bubbles, hot air blower with big red X marks, comedy science.",
        durationSeconds: 5,
      },
      {
        number: 5,
        stage: "Risas",
        title: "¿Cómo Congelamos Todo el Pueblo?",
        visualAction: "Saúl y César miran la calle exterior donde hasta las bicicletas y los botes de basura están pegados en telaraña.",
        cameraAngle: "Plano general de la calle pueblerina con niebla cómica.",
        dialogue: [
          { speaker: "Cesar", text: "¿Entonces necesitamos congelarlo? ¿Cómo congelamos todo el pueblo?", emotion: "Asombrado" },
          { speaker: "Saul", text: "...no sé.", emotion: "Mirada perdida" },
        ],
        sfx: "whoosh",
        fxFlowPrompt: "Wide 3D cartoon shot: cobblestone town street with bicycles and streetlamps covered in sticky web strands, Saúl and César looking stunned.",
        durationSeconds: 5,
      },
    ],
  },
  {
    id: "ep-04-communication-first",
    episodeNumber: 3,
    title: "La Comunicación Viene Primero",
    lesson: "Aprender a escuchar antes de actuar",
    tagline: "El mapa al revés y la confusión en el taller.",
    synopsis: "César lee las instrucciones de cabeza mientras Saúl construye la máquina al revés. Caos cómico hasta que deciden hablarse de frente.",
    sheetSource: SHOW_ASSETS.CONCEPT_BIBLE,
    scenes: [
      {
        number: 1,
        stage: "Curiosidad",
        title: "El Instructivo Chueco",
        visualAction: "César sostiene un plano de diseño al revés mientras Saúl con martillo en mano lo mira extrañado.",
        cameraAngle: "Plano medio en el taller.",
        dialogue: [
          { speaker: "Cesar", text: "Dice que la tuerca va en el techo...", emotion: "Seguro" },
          { speaker: "Saul", text: "¿En el techo? A ver, dame ese papel...", emotion: "Sospechoso" },
        ],
        sfx: "click",
        fxFlowPrompt: "3D animation: César holding an engineering blueprint upside down, Saúl with hammer looking skeptical.",
        durationSeconds: 4,
      },
    ],
  },
  {
    id: "ep-05-two-steps-ahead",
    episodeNumber: 4,
    title: "Dos Pasos Adelante",
    lesson: "Planear y prever las consecuencias",
    tagline: "César olvidó el paso 2 y la tostadora salió volando.",
    synopsis: "Por querer acelerar la construcción de un tostador supersónico, César se brinca un paso vital que Saúl ya había calculado.",
    sheetSource: SHOW_ASSETS.CONCEPT_BIBLE,
    scenes: [
      {
        number: 1,
        stage: "Curiosidad",
        title: "El Atajo de César",
        visualAction: "César presiona un interruptor antes de conectar los disipadores de calor.",
        cameraAngle: "Plano detalle a la mano de César.",
        dialogue: [
          { speaker: "Saul", text: "¡Falta el paso dos!", emotion: "Gritando" },
          { speaker: "Cesar", text: "¡Los genios no necesitan el paso dos!", emotion: "Confiado" },
        ],
        sfx: "zap",
        fxFlowPrompt: "3D cartoon shot: César skipping instructions to flip a power switch on a smoking toaster rocket.",
        durationSeconds: 4,
      },
    ],
  },
  {
    id: "ep-06-body-switch",
    episodeNumber: 5,
    title: "El Botón Equivocado (Cambio de Cuerpo)",
    lesson: "Empatía: Ponerse en los zapatos del otro",
    tagline: "Saúl amanece con los rizos de César y César con la gorra.",
    synopsis: "Un botón misterioso intercambia las conciencias de Saúl y César. Para regresar a la normalidad, tienen que comprender lo difícil que es ser el otro.",
    sheetSource: SHOW_ASSETS.CONCEPT_BIBLE,
    scenes: [
      {
        number: 1,
        stage: "Caos",
        title: "El Intercambio",
        visualAction: "Saúl se toca el cabello rizado 70s y los lentes redondos mientras César se acomoda la gorra negra sin entender nada.",
        cameraAngle: "Plano medio a ambos mirándose al espejo.",
        dialogue: [
          { speaker: "Saul", text: "¡¿Por qué tengo lentes gigantes y veo todo borroso?!", emotion: "Aterrado con voz de Saúl en cuerpo de César" },
          { speaker: "Cesar", text: "¡¿Y por qué no veo nada debajo de esta gorra?!", emotion: "Confundido con voz de César en cuerpo de Saúl" },
        ],
        sfx: "whoosh",
        fxFlowPrompt: "3D comedic mirror shot: Saúl trapped in César's body touching round glasses, César trapped in Saúl's body pulling black cap, shocked expressions.",
        durationSeconds: 5,
      },
    ],
  },
  {
    id: "ep-07-emergency-kit",
    episodeNumber: 6,
    title: "El Kit de Emergencia",
    lesson: "Estar preparado y mantener la calma",
    tagline: "El kit de emergencia explota... literalmente.",
    synopsis: "César prepara un kit con tantas cosas que termina presurizado como una olla exprés hasta que estalla en palomitas de maíz y confeti.",
    sheetSource: SHOW_ASSETS.CONCEPT_BIBLE,
    scenes: [
      {
        number: 1,
        stage: "Curiosidad",
        title: "La Lata Presurizada",
        visualAction: "César empuja con un palo cosas dentro de una lata marcada 'EMERGENCY KIT' que empieza a vibrar.",
        cameraAngle: "Plano cerrado a la lata temblorosa.",
        dialogue: [
          { speaker: "Cesar", text: "¡Todavía le cabe una linterna más!", emotion: "Empecinado" },
          { speaker: "Saul", text: "César... esa lata se va a...", emotion: "Dando un paso atrás" },
        ],
        sfx: "explosion",
        fxFlowPrompt: "3D cartoon scene: bulging vibrating metal can labeled 'EMERGENCY KIT' with bolts flying, comedy anticipation.",
        durationSeconds: 4,
      },
    ],
  },
];
