<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
    <Header />

    <main class="mx-auto max-w-[1400px] px-4 py-10">
      <!-- Título -->
      <div class="text-center mb-10">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Generador de Exámenes</h1>
        <p class="mt-2 text-slate-500 max-w-2xl mx-auto">
          Convierte tus apuntes o PDFs en exámenes personalizados en segundos.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 items-start">
        <!-- Anuncio izquierdo -->
        <aside class="hidden lg:block">
          <div class="h-[900px] bg-white border rounded-2xl shadow-sm flex items-center justify-center">
            <span class="text-slate-400 text-sm">Espacio publicitario</span>
          </div>
        </aside>

        <!-- Contenido principal -->
        <section class="bg-white rounded-2xl shadow-sm border p-8 md:p-10">
          <!-- Entrada de apuntes -->
          <div class="mb-8">
            <label class="block text-sm font-medium text-slate-600 mb-2">
              Apuntes o contenido del examen
            </label>
            <textarea
              v-model="apuntes"
              rows="8"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Pega aquí tus apuntes o sube un PDF…"
            ></textarea>
          </div>

          <!-- PDF -->
          <div class="mb-10 flex flex-col items-center gap-3">
            <label
              for="pdf-upload"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm cursor-pointer hover:bg-blue-700"
            >
              <i class="fa-solid fa-file-pdf"></i> Subir PDF
            </label>
            <span class="text-sm text-slate-500">{{ archivoNombre }}</span>
            <input id="pdf-upload" type="file" accept="application/pdf" class="hidden" @change="handlePdfUploadCustom" />
          </div>

          <!-- Configuración -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <!-- Dificultad -->
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Dificultad</label>
              <select
                v-model="dificultad"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option disabled value="">Selecciona dificultad</option>
                <option value="facil">Fácil</option>
                <option value="medio">Media</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            <!-- Preguntas -->
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Número de preguntas</label>
              <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>5</span><span>20</span>
              </div>
              <input type="range" min="5" max="20" step="5" v-model.number="numPreguntas" class="w-full" />
            </div>
          </div>

          <!-- Tipo de examen -->
          <div class="mb-10">
            <h3 class="text-sm font-medium text-slate-600 mb-4">Tipo de examen</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                v-for="tipo in tipos"
                :key="tipo"
                class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-blue-500"
              >
                <input type="radio" :value="tipo" v-model="tipoExamen" />
                <span class="text-sm text-slate-700">{{ tipo }}</span>
              </label>
            </div>
          </div>

          <!-- Botón -->
          <button
            @click="generarExamen"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {{ loading ? 'Generando examen…' : 'Generar examen' }}
          </button>

          <!-- Resultado -->
          <div v-if="resultado" class="mt-12">
            <h3 class="font-semibold text-slate-800 mb-4">Examen generado</h3>
            <div class="prose max-w-none" v-html="resultado.replace(/\n/g, '<br/>')"></div>

            <button
              v-if="hayRespuestas"
              @click="toggleResuelto"
              class="mt-6 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm"
            >
              {{ mostrarResuelto ? 'Ocultar soluciones' : 'Ver examen resuelto' }}
            </button>

            <div v-if="mostrarResuelto" class="mt-4 bg-slate-50 border rounded-lg p-4">
              <pre class="whitespace-pre-wrap text-sm text-slate-700">{{ respuestas }}</pre>
            </div>
          </div>

          <p v-if="error" class="mt-6 text-center text-red-500">{{ error }}</p>
        </section>

        <!-- Anuncio derecho -->
        <aside class="hidden lg:block">
          <div class="h-[900px] bg-white border rounded-2xl shadow-sm flex items-center justify-center">
            <span class="text-slate-400 text-sm">Espacio publicitario</span>
          </div>
        </aside>
      </div>
    </main>

    <Footer />
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
