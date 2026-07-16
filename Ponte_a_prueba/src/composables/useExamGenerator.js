import { ref, unref } from 'vue'
import { saveExam, generateExam } from '@/services/examService'
import { userStore } from '@/stores/userStores'

// Da formato visual (numeración y saltos de línea) al texto crudo devuelto por la IA.
function darFormatoVisual(texto) {
  if (!texto) return ''
  let t = texto
  let contador = 1
  t = t.replace(/(^|\n)\s*\d+([\.\)-])\s/g, (match, inicio) => {
    return `${inicio}${contador++}. `
  })
  t = t.replace(/(\s)([a-e]\))/g, '\n   $2')
  t = t.replace(/(\n)(\d+\.)/g, '\n\n\n$2')
  return t
}

// Estado y lógica compartidos por todas las pantallas de generación de exámenes
// (General, Carnet de conducir, Programación, Oposiciones policía y Modo Reto).
// `categoria` y `modo` pueden ser valores fijos o refs.
export function useExamGenerator({ categoria, modo = 'normal', tituloPrefix = 'Examen' } = {}) {
  const apuntes = ref('')
  const tema = ref('')
  const fuenteActiva = ref('apuntes') // 'apuntes' | 'tema'
  const dificultad = ref('medio')
  const numPreguntas = ref(5)
  const tipoExamen = ref('Test (4 opciones)')
  const archivoNombre = ref('')

  const loading = ref(false)
  const error = ref(null)
  const esErrorDeLimite = ref(false)
  const esErrorDeAuth = ref(false)

  const resultado = ref('')
  const respuestasInternas = ref('')
  const respuestas = ref('')
  const mostrarResuelto = ref(false)
  const hayRespuestas = ref(false)

  async function handlePdfUploadCustom(event) {
    const file = event.target.files[0]
    if (!file) return
    archivoNombre.value = file.name

    try {
      const pdfjsLib = await import('pdfjs-dist')
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
      }

      const buffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
      let text = ''
      for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(it => it.str).join(' ') + '\n\n'
      }
      apuntes.value = text
    } catch (e) {
      console.error('Error cargando PDF', e)
      error.value = 'Error al leer el archivo PDF'
    }
  }

  function validar() {
    if (!dificultad.value || !tipoExamen.value) {
      error.value = 'Por favor completa todos los campos.'
      return false
    }
    if (fuenteActiva.value === 'apuntes' && !apuntes.value.trim()) {
      error.value = 'Pega tus apuntes o sube un PDF para generar el examen.'
      return false
    }
    if (fuenteActiva.value === 'tema' && !tema.value.trim()) {
      error.value = 'Elige o escribe un tema para generar el examen.'
      return false
    }
    if (!userStore.token) {
      error.value = 'Debes iniciar sesión.'
      esErrorDeAuth.value = true
      return false
    }
    return true
  }

  // Genera el examen y lo guarda automáticamente. Devuelve { preguntas, respuestas }
  // en crudo para que cada vista pueda darles el tratamiento que necesite
  // (mostrar como texto, o parsear a tarjetas en el Modo Reto).
  async function generar() {
    error.value = null
    esErrorDeLimite.value = false
    esErrorDeAuth.value = false

    if (!validar()) return null

    loading.value = true
    resultado.value = ''
    respuestas.value = ''
    mostrarResuelto.value = false

    const categoriaValor = unref(categoria) || 'general'
    const modoValor = unref(modo) || 'normal'

    try {
      const dto = {
        tipo: tipoExamen.value,
        dificultad: dificultad.value,
        numPreguntas: Number(numPreguntas.value),
        categoria: categoriaValor,
        modo: modoValor,
        apuntes: fuenteActiva.value === 'apuntes' ? apuntes.value : '',
        tema: fuenteActiva.value === 'tema' ? tema.value : '',
      }

      const data = await generateExam(dto)

      resultado.value = darFormatoVisual(data.preguntas)
      respuestasInternas.value = darFormatoVisual(data.respuestas)
      hayRespuestas.value = true

      await saveExam({
        title: `${tituloPrefix} · ${new Date().toLocaleDateString()}`,
        tipo: tipoExamen.value,
        dificultad: dificultad.value,
        numPreguntas: Number(numPreguntas.value),
        apuntes: dto.apuntes ? 'Apuntes procesados' : '',
        preguntas: data.preguntas,
        respuestas: data.respuestas,
        categoria: categoriaValor,
        tema: dto.tema,
        modo: modoValor,
      })

      return data
    } catch (e) {
      if (e.response && e.response.status === 403) {
        error.value = 'Límite alcanzado.'
        esErrorDeLimite.value = true
      } else if (e.response && e.response.status === 400) {
        error.value = e.response.data?.message || 'Datos incompletos para generar el examen.'
      } else {
        error.value = 'Error generando el examen.'
      }
      return null
    } finally {
      loading.value = false
    }
  }

  function toggleResuelto() {
    mostrarResuelto.value = !mostrarResuelto.value
    respuestas.value = mostrarResuelto.value ? respuestasInternas.value : ''
  }

  return {
    apuntes,
    tema,
    fuenteActiva,
    dificultad,
    numPreguntas,
    tipoExamen,
    archivoNombre,
    loading,
    error,
    esErrorDeLimite,
    esErrorDeAuth,
    resultado,
    respuestasInternas,
    respuestas,
    mostrarResuelto,
    hayRespuestas,
    handlePdfUploadCustom,
    generar,
    toggleResuelto,
  }
}
