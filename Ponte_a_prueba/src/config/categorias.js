// Fuente única de verdad de las categorías de examen.
// La usan tanto el generador principal (HomeView) como el Modo Reto.
export const CATEGORIAS = [
  {
    id: 'general',
    label: 'General',
    icon: 'fa-solid fa-file-lines',
    descripcion: 'Convierte tus propios apuntes o PDFs en un examen personalizado.',
    temas: null, // sin temas predefinidos: siempre por apuntes/PDF
  },
  {
    id: 'carnet_conducir',
    label: 'Carnet de conducir',
    icon: 'fa-solid fa-car',
    descripcion: 'Preguntas al estilo del examen teórico oficial de la DGT.',
    temas: [
      'Señales de tráfico',
      'Normas de circulación y velocidad',
      'Prioridad y adelantamientos',
      'Mecánica y seguridad del vehículo',
      'Primeros auxilios',
      'Percepción y comportamiento en carretera',
    ],
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
  },
  {
    id: 'oposiciones_policia',
    label: 'Oposiciones policía',
    icon: 'fa-solid fa-shield-halved',
    descripcion: 'Preguntas al estilo de las oposiciones a Policía Nacional/Local.',
    temas: [
      'Constitución Española',
      'Organización del Estado y Administración Pública',
      'Derecho penal básico',
      'Derechos humanos y actuación policial',
      'Actualidad y cultura general',
    ],
  },
]

export function getCategoria(id) {
  return CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0]
}

// Categorías con temas predefinidos, usadas por el Modo Reto (excluye "general").
export const CATEGORIAS_RETO = CATEGORIAS.filter(c => c.temas)
