<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header/>

    <main class="flex-grow flex justify-center items-center p-4">
      <div class="flex flex-col lg:flex-row gap-6 items-start max-w-[1440px] w-full">

        <aside class="hidden lg:flex justify-center flex-shrink-0">
          <div class="w-72 h-[915px] bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 text-sm">Anuncio</span>
          </div>
        </aside>

        <div class="flex-1 bg-white w-full rounded-2xl shadow-xl p-6 md:p-12 min-h-[70vh] flex flex-col justify-center">
          <h2 class="text-center text-[#546E7A] font-bold text-sm mb-3 md:text-lg">
            Pegue aquí los apuntes o suba un PDF
          </h2>

          <textarea
            v-model="apuntes"
            class="w-full h-40 md:h-[300px] p-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-600 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-[#3978D7]"
            placeholder="Escriba o copie un archivo PDF aquí..."
          ></textarea>

          <div class="my-6 flex flex-col items-center gap-4">
            <label
              for="pdf-upload"
              class="bg-[#3978D7] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#2d62b3]"
            >
              Subir PDF
            </label>
            <span class="text-sm md:text-base">{{ archivoNombre }}</span>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              class="hidden"
              @change="handlePdfUploadCustom"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mb-6">
            <select
              v-model="dificultad"
              class="w-full border border-gray-400 rounded-lg p-2.5 text-gray-500"
            >
              <option disabled value="">Elija la dificultad</option>
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
            </select>

            <div>
              <div class="flex justify-between items-center mb-2 text-sm md:text-base">
                <span>5</span>
                <span class="font-semibold">Número de preguntas</span>
                <span>20</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                step="5"
                v-model.number="numPreguntas"
                class="w-full"
              />
            </div>
          </div>

          <div class="mb-8 flex flex-col items-center">
            <h3 class="text-center font-medium mb-4">Tipo de examen</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label v-for="tipo in tipos" :key="tipo" class="flex gap-2 items-center">
                <input type="radio" :value="tipo" v-model="tipoExamen" />
                <span>{{ tipo }}</span>
              </label>
            </div>
          </div>

          <button
            @click="generarExamen"
            :disabled="loading"
            class="w-full bg-[#3978D7] hover:bg-[#2d62b3] text-white py-3 rounded-lg disabled:opacity-50"
          >
            {{ loading ? "Generando..." : "Generar Examen" }}
          </button>

          <div v-if="resultado" class="mt-10">
            <h3 class="font-bold mb-4">Examen generado</h3>
            <div v-html="resultado.replace(/\n/g, '<br/>')"></div>

            <button
              v-if="hayRespuestas"
              @click="toggleResuelto"
              class="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              {{ mostrarResuelto ? "Ocultar Resuelto" : "Ver Examen Resuelto" }}
            </button>

            <div v-if="mostrarResuelto" class="mt-4 p-4 bg-gray-50 border rounded">
              <pre class="whitespace-pre-wrap font-sans">{{ respuestas }}</pre>
            </div>
          </div>

          <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
        </div>

        <aside class="hidden lg:flex justify-center flex-shrink-0">
          <div class="w-72 h-[915px] bg-gray-100 rounded-lg flex items-center justify-center">
            <span class="text-gray-400 text-sm">Anuncio</span>
          </div>
        </aside>

      </div>
    </main>

    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
import { sendChat } from '@/services/ollamaService'
import { saveExam } from '@/services/examService'
import { userStore } from "@/stores/userStores"

const apuntes = ref("")
const dificultad = ref("")
const numPreguntas = ref(5) // Por defecto 5
const tipoExamen = ref("")
const loading = ref(false)
const resultado = ref("")
const respuestasInternas = ref("")
const respuestas = ref("")
const mostrarResuelto = ref(false)
const hayRespuestas = ref(false)
const error = ref(null)
const archivoNombre = ref("Ningún archivo seleccionado")

const tipos = [
  "Test (4 opciones)",
  "Verdadero/Falso",
  "Respuestas cortas",
  "Respuestas largas",
  "Mix"
]

onMounted(() => {
  userStore.loadSession()
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
})

async function handlePdfUploadCustom(event) {
  const file = event.target.files[0]
  if (!file) return

  archivoNombre.value = file.name
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  let text = ""
  // Limitamos a 50 páginas para no saturar memoria, ajustable
  for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(i => i.str).join(" ") + "\n\n"
  }

  apuntes.value = text
}

// Función para dividir en bloques de 5 preguntas
function dividirBloques(total) {
  const bloques = []
  let restantes = total
  while (restantes > 0) {
    bloques.push(Math.min(5, restantes))
    restantes -= 5
  }
  return bloques
}

// -----------------------------------------------------------------------
// PROMPTS AJUSTADOS (LÓGICA ANTI-ALUCINACIONES)
// -----------------------------------------------------------------------

const promptPreguntas = (cantidad, inicio, preguntasPrevias) => {
  const tipo = tipoExamen.value;
  // Recortamos apuntes para no exceder tokens, pero mantenemos suficiente contexto
  const ap = apuntes.value.substring(0, 15000);

  // Instrucción de sistema inyectada en el user prompt para reforzar obediencia
  const instruccionBase = `
ROL: Eres un generador de exámenes académico estricto.
TAREA: Generar preguntas de examen basadas en el texto proporcionado.
REGLA DE ORO: NO converses. NO saludes. SOLO entrega el contenido del examen.
`;

  // Contexto negativo: Qué NO debe preguntar porque ya se hizo
  const contextoNegativo = preguntasPrevias.length > 10
    ? `HISTORIAL: Ya has generado estas preguntas anteriormente:
"""
${preguntasPrevias}
"""
INSTRUCCIÓN CRÍTICA: NO repitas ninguna de las preguntas anteriores ni sus temáticas exactas. Busca nuevos ángulos o temas en los apuntes.`
    : "";

  if (tipo === "Test (4 opciones)") {
    return `${instruccionBase}
${contextoNegativo}

INSTRUCCIONES DE FORMATO:
1. Genera EXACTAMENTE ${cantidad} preguntas de opción múltiple.
2. La PRIMERA pregunta de esta lista DEBE ser la número ${inicio}. (Ejemplo: ${inicio}. ¿Pregunta...?)
3. Formato:
${inicio}. Enunciado
a) Opción
b) Opción
c) Opción
d) Opción

4. NO indiques la respuesta correcta todavía.
5. Usa un lenguaje formal y académico.

TEXTO BASE (APUNTES):
""" ${ap} """`;
  }

  if (tipo === "Verdadero/Falso") {
    return `${instruccionBase}
${contextoNegativo}

INSTRUCCIONES DE FORMATO:
1. Genera EXACTAMENTE ${cantidad} afirmaciones.
2. La PRIMERA afirmación DEBE ser la número ${inicio}.
3. Formato:
${inicio}. [Afirmación]

TEXTO BASE (APUNTES):
""" ${ap} """`;
  }

  if (tipo === "Respuestas cortas" || tipo === "Respuestas largas") {
    return `${instruccionBase}
${contextoNegativo}

INSTRUCCIONES DE FORMATO:
1. Genera EXACTAMENTE ${cantidad} preguntas abiertas.
2. La PRIMERA pregunta DEBE ser la número ${inicio}.
3. Formato:
${inicio}. [Pregunta]

TEXTO BASE (APUNTES):
""" ${ap} """`;
  }

  // Fallback genérico para Mix
  return `${instruccionBase}
${contextoNegativo}
Genera ${cantidad} preguntas variadas (Test, V/F, Abiertas) empezando por el número ${inicio}.
TEXTO BASE: """ ${ap} """`;
};

const promptRespuestas = (preguntas) => {
  const tipo = tipoExamen.value;
  const ap = apuntes.value.substring(0, 15000);

  const instruccionBase = `Eres un motor de corrección automatizado.
TU OBJETIVO: Proveer la clave de respuestas correcta basada en el texto.
FORMATO DE SALIDA: Lista numerada simple. Sin explicaciones extra.`;

  if (tipo === "Test (4 opciones)") {
    return `${instruccionBase}
INSTRUCCIONES:
- Devuelve solo el número y la letra.
- Ejemplo:
1. a
2. c

PREGUNTAS A RESOLVER:
""" ${preguntas} """
REFERENCIA: """ ${ap} """`;
  }

  if (tipo === "Verdadero/Falso") {
    return `${instruccionBase}
INSTRUCCIONES:
- Devuelve número y "Verdadero" o "Falso".
- Ejemplo:
1. Verdadero
2. Falso

PREGUNTAS A RESOLVER:
""" ${preguntas} """
REFERENCIA: """ ${ap} """`;
  }

  return `${instruccionBase}
INSTRUCCIONES:
- Responde de forma concisa y académica.
- Respeta la numeración original.

PREGUNTAS A RESOLVER:
""" ${preguntas} """
REFERENCIA: """ ${ap} """`;
};

// -----------------------------------------------------------------------

function respuestasValidas(texto) {
  if (!texto) return false
  if (texto.length < 5) return false
  const t = texto.toLowerCase()
  if (t.includes("no puedo") || t.includes("lo siento") || t.includes("contexto")) return false
  return true
}

async function guardarExamen() {
  if (!userStore.token) return
  try {
    await saveExam({
      title: `Examen ${tipoExamen.value} · ${new Date().toLocaleDateString()}`,
      tipo: tipoExamen.value,
      dificultad: dificultad.value,
      numPreguntas: Number(numPreguntas.value),
      apuntes: 'Apuntes procesados', // No guardamos todo el tocho de texto
      preguntas: resultado.value,
      respuestas: respuestasInternas.value
    })
  } catch (e) {
    console.error("Error guardando examen:", e)
  }
}

// Lógica principal de generación
async function generarExamen() {
  if (!apuntes.value || !dificultad.value || !tipoExamen.value) {
    error.value = "Por favor completa todos los campos (apuntes, dificultad, tipo)."
    return
  }

  loading.value = true
  error.value = null
  resultado.value = ""
  respuestas.value = ""
  respuestasInternas.value = ""
  mostrarResuelto.value = false
  hayRespuestas.value = false

  // Variables para controlar el flujo
  let contextoGenerado = ""; // ACUMULADOR DE PREGUNTAS PREVIAS
  let contadorPreguntas = 1;
  const bloques = dividirBloques(numPreguntas.value)

  try {
    for (let bloqueSize of bloques) {

      // 1. Generar Preguntas (Pasando historial para evitar duplicados)
      const promptPreg = promptPreguntas(bloqueSize, contadorPreguntas, contextoGenerado)

      const respPreg = await sendChat([
        { role: "system", content: "Eres una máquina estricta de generación de exámenes. No añadas texto de relleno." },
        { role: "user", content: promptPreg }
      ])

      // Limpieza agresiva de Markdown y metatexto
      let preguntasBloque = respPreg.message?.content?.trim() || ""
      preguntasBloque = preguntasBloque
        .replace(/```json/g, '')
        .replace(/```text/g, '')
        .replace(/```/g, '')
        .replace(/Aqui tienes.*/gi, '') // Elimina saludos típicos
        .trim();

      // Acumulamos para mostrar al usuario
      resultado.value += preguntasBloque + "\n\n"

      // Acumulamos en el historial para la IA (para que no repita en la siguiente vuelta)
      contextoGenerado += preguntasBloque + "\n";

      // 2. Generar Respuestas para este bloque
      let respuestasBloque = ""
      let intentos = 0

      // Pequeño reintento si la IA falla al responder
      while (!respuestasValidas(respuestasBloque) && intentos < 2) {
        const promptResp = promptRespuestas(preguntasBloque)

        const resp = await sendChat([
          { role: "system", content: "Eres un profesor corrigiendo un examen. Sé directo." },
          { role: "user", content: promptResp }
        ])

        respuestasBloque = resp.message?.content?.trim() || ""
        respuestasBloque = respuestasBloque.replace(/```/g, '').trim()
        intentos++
      }

      respuestasInternas.value += respuestasBloque + "\n"

      // Avanzamos el contador para que el siguiente bloque empiece bien (ej. 6, 11, etc.)
      contadorPreguntas += bloqueSize;
    }

    hayRespuestas.value = true
    await guardarExamen()

  } catch (e) {
    console.error(e)
    error.value = "Hubo un error al generar el examen. Por favor, intenta con un texto más corto o prueba de nuevo."
  } finally {
    loading.value = false
  }
}

function toggleResuelto() {
  mostrarResuelto.value = !mostrarResuelto.value
  respuestas.value = mostrarResuelto.value ? respuestasInternas.value : ""
}
</script>
