// Fuente única de verdad de las categorías de examen.
// La usan tanto el generador principal (HomeView) como el Modo Reto.
//
// Cada categoría lleva un objeto `theme` con clases Tailwind COMPLETAS
// (nunca construidas en runtime: el JIT de Tailwind purgaría clases
// interpoladas). `backdrop` identifica el fondo decorativo que pinta
// CategoryBackdrop.vue.

export const CATEGORIAS = [
  {
    id: 'general',
    label: 'General',
    icon: 'fa-solid fa-file-lines',
    descripcion: 'Convierte tus propios apuntes o PDFs en un examen personalizado.',
    temas: null, // sin temas predefinidos: siempre por apuntes/PDF
    theme: {
      accentText: 'text-indigo-400',
      accentTextSoft: 'text-indigo-300',
      chip: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
      optionActive: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-bold shadow-lg shadow-indigo-900/10',
      segmentActive: 'bg-slate-800 text-indigo-400 shadow-lg border border-white/5',
      tabActive: 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30 scale-[1.03]',
      button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30 hover:shadow-indigo-900/50',
      topBar: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
      progress: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      titleGradient: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400',
      focusRing: 'focus:ring-indigo-500/20 focus:border-indigo-500/50',
      accentHex: '#6366f1',
      backdrop: 'estudio',
    },
  },
  {
    id: 'carnet_conducir',
    label: 'Carnet de conducir',
    icon: 'fa-solid fa-car',
    descripcion: 'Preguntas al estilo del examen teórico oficial de la DGT (Española).',
    temas: [
      'Señales de tráfico',
      'Normas de circulación y velocidad',
      'Prioridad y adelantamientos',
      'Mecánica y seguridad del vehículo',
      'Primeros auxilios',
      'Percepción y comportamiento en carretera',
    ],
    theme: {
      accentText: 'text-amber-400',
      accentTextSoft: 'text-amber-300',
      chip: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
      optionActive: 'border-amber-500/50 bg-amber-500/10 text-amber-300 font-bold shadow-lg shadow-amber-900/10',
      segmentActive: 'bg-slate-800 text-amber-400 shadow-lg border border-white/5',
      tabActive: 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/30 scale-[1.03]',
      button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30 hover:shadow-amber-900/50',
      topBar: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600',
      progress: 'bg-gradient-to-r from-amber-500 to-orange-500',
      titleGradient: 'bg-gradient-to-r from-amber-400 via-orange-400 to-red-400',
      focusRing: 'focus:ring-amber-500/20 focus:border-amber-500/50',
      accentHex: '#f59e0b',
      backdrop: 'carretera',
    },
  },
  {
    id: 'programacion',
    label: 'Programación',
    icon: 'fa-solid fa-code',
    descripcion: 'Preguntas técnicas para poner a prueba tus conocimientos de programación.',
    temas: [
      'Fundamentos y sintaxis',
      'Estructuras de datos',
      'Programación orientada a objetos',
      'Bases de datos y SQL',
      'Algoritmos y complejidad',
      'Desarrollo web',
    ],
    theme: {
      accentText: 'text-emerald-400',
      accentTextSoft: 'text-emerald-300',
      chip: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      optionActive: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 font-bold shadow-lg shadow-emerald-900/10',
      segmentActive: 'bg-slate-800 text-emerald-400 shadow-lg border border-white/5',
      tabActive: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/30 scale-[1.03]',
      button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30 hover:shadow-emerald-900/50',
      topBar: 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600',
      progress: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      titleGradient: 'bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400',
      focusRing: 'focus:ring-emerald-500/20 focus:border-emerald-500/50',
      accentHex: '#10b981',
      backdrop: 'terminal',
    },
  },
  {
    id: 'oposiciones_policia',
    label: 'Oposiciones policía',
    icon: 'fa-solid fa-shield-halved',
    descripcion: 'Preguntas al estilo de las oposiciones a Policía Nacional/Local (España).',
    temas: [
      'Constitución Española',
      'Organización del Estado y Administración Pública',
      'Derecho penal básico',
      'Derechos humanos y actuación policial',
      'Actualidad y cultura general',
    ],
    theme: {
      accentText: 'text-sky-400',
      accentTextSoft: 'text-sky-300',
      chip: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
      optionActive: 'border-sky-500/50 bg-sky-500/10 text-sky-300 font-bold shadow-lg shadow-sky-900/10',
      segmentActive: 'bg-slate-800 text-sky-400 shadow-lg border border-white/5',
      tabActive: 'bg-blue-700 border-blue-500 text-white shadow-lg shadow-blue-900/30 scale-[1.03]',
      button: 'bg-blue-700 hover:bg-blue-600 shadow-blue-900/30 hover:shadow-blue-900/50',
      topBar: 'bg-gradient-to-r from-blue-600 via-sky-500 to-red-600',
      progress: 'bg-gradient-to-r from-blue-500 to-sky-400',
      titleGradient: 'bg-gradient-to-r from-blue-400 via-sky-400 to-red-400',
      focusRing: 'focus:ring-sky-500/20 focus:border-sky-500/50',
      accentHex: '#0ea5e9',
      backdrop: 'policia',
    },
  },
]

export function getCategoria(id) {
  return CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0]
}

// Tema visual con fallback al de "general" (exámenes antiguos o ids desconocidos)
export function getTheme(id) {
  return getCategoria(id).theme
}

// Categorías con temas predefinidos, usadas por el Modo Reto (excluye "general").
export const CATEGORIAS_RETO = CATEGORIAS.filter(c => c.temas)
