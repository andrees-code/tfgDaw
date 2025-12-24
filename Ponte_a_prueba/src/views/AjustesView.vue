<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header />

    <!-- BOTÓN MENÚ MÓVIL -->
    <div class="md:hidden p-4">
      <button
        @click="menuAbierto = !menuAbierto"
        class="bg-[#3978D7] text-white px-4 py-2 rounded-lg w-full"
      >
        ☰ Ajustes
      </button>
    </div>

    <main class="flex-grow flex md:p-4 gap-6">

      <!-- SIDEBAR -->
      <aside
        :class="[
          'bg-white rounded-2xl shadow-lg p-4 overflow-y-auto md:w-64',
          menuAbierto ? 'block' : 'hidden md:block'
        ]"
      >
        <h3 class="font-bold text-gray-600 mb-4">Configuración</h3>

        <ul class="space-y-2">
          <li v-for="item in menu" :key="item.id">
            <button
              @click="cambiarSeccion(item.id)"
              class="w-full text-left px-3 py-2 rounded-lg transition"
              :class="seccionActiva === item.id
                ? 'bg-[#3978D7] text-white'
                : 'hover:bg-gray-100 text-gray-600'"
            >
              <i :class="item.icon" class="mr-2"></i>{{ item.label }}
            </button>
          </li>
        </ul>
      </aside>

      <!-- CONTENIDO -->
      <section
        class="flex-1 bg-white rounded-2xl shadow-xl p-6 overflow-y-auto
               max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-120px)]"
      >

        <!-- GENERALES -->
        <div v-if="seccionActiva === 'general'" class="space-y-6">
          <h2 class="text-xl font-bold">⚙️ Generales</h2>

          <label class="flex justify-between">
            Guardar último examen automáticamente
            <input type="checkbox" v-model="ajustes.autoGuardar" />
          </label>

          <label class="flex justify-between">
            Confirmar antes de sobrescribir
            <input type="checkbox" v-model="ajustes.confirmarSobrescritura" />
          </label>

          <div>
            <label>Límite de páginas PDF a leer</label>
            <input type="number" class="w-full border rounded p-2"
                   v-model="ajustes.limitePaginasPdf" />
          </div>

          <label class="flex justify-between">
            Forzar español de España
            <input type="checkbox" v-model="ajustes.forzarES" />
          </label>
        </div>

        <!-- EXÁMENES -->
        <div v-if="seccionActiva === 'examenes'" class="space-y-6">
          <h2 class="text-xl font-bold">📝 Exámenes</h2>

          <div>
            <label>Mínimo de preguntas</label>
            <input type="number" class="w-full border rounded p-2"
                   v-model="ajustes.minPreguntas" />
          </div>

          <div>
            <label>Máximo de preguntas</label>
            <input type="number" class="w-full border rounded p-2"
                   v-model="ajustes.maxPreguntas" />
          </div>

          <label class="flex justify-between">
            Mezclar orden de preguntas
            <input type="checkbox" v-model="ajustes.mezclarPreguntas" />
          </label>

          <label class="flex justify-between">
            Mezclar opciones tipo test
            <input type="checkbox" v-model="ajustes.mezclarOpciones" />
          </label>

          <label class="flex justify-between">
            Mostrar botón de respuestas
            <input type="checkbox" v-model="ajustes.botonRespuestas" />
          </label>
        </div>

        <!-- IA -->
        <div v-if="seccionActiva === 'ia'" class="space-y-6">
          <h2 class="text-xl font-bold">🤖 Inteligencia Artificial</h2>

          <label class="flex justify-between">
            Usar SOLO los apuntes (no inventar)
            <input type="checkbox" v-model="ajustes.estrictoApuntes" />
          </label>

          <div>
            <label>Reintentos automáticos</label>
            <input type="number" class="w-full border rounded p-2"
                   v-model="ajustes.reintentosIA" />
          </div>

          <div>
            <label>Longitud de respuestas</label>
            <select class="w-full border rounded p-2"
                    v-model="ajustes.longitudRespuestas">
              <option value="corta">Corta</option>
              <option value="media">Media</option>
              <option value="larga">Larga</option>
            </select>
          </div>

          <label class="flex justify-between">
            Forzar formato exacto
            <input type="checkbox" v-model="ajustes.formatoEstricto" />
          </label>
        </div>

        <!-- ERRORES -->
        <div v-if="seccionActiva === 'errores'" class="space-y-6">
          <h2 class="text-xl font-bold">🔔 Errores y control</h2>

          <label class="flex justify-between">
            Mostrar errores técnicos
            <input type="checkbox" v-model="ajustes.erroresTecnicos" />
          </label>

          <div>
            <label>Timeout de generación (ms)</label>
            <input type="number" class="w-full border rounded p-2"
                   v-model="ajustes.timeoutIA" />
          </div>
        </div>

        <!-- GUARDAR -->
        <div class="mt-10">
          <button
            @click="guardarAjustes"
            class="bg-[#3978D7] hover:bg-[#2d62b3] text-white px-6 py-3 rounded-lg w-full md:w-auto"
          >
            Guardar ajustes
          </button>
        </div>

      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Header from "@/components/HeaderCompleto.vue"

const menuAbierto = ref(false)
const seccionActiva = ref("general")

const menu = [
  { id: "general", label: "Generales", icon: "fas fa-cog" },
  { id: "examenes", label: "Exámenes", icon: "fas fa-file-alt" },
  { id: "ia", label: "IA", icon: "fas fa-robot" },
  { id: "errores", label: "Errores", icon: "fas fa-bell" }
]

const ajustes = ref({
  autoGuardar: true,
  confirmarSobrescritura: true,
  limitePaginasPdf: 50,
  forzarES: true,

  minPreguntas: 5,
  maxPreguntas: 20,
  mezclarPreguntas: true,
  mezclarOpciones: true,
  botonRespuestas: true,

  estrictoApuntes: true,
  reintentosIA: 2,
  longitudRespuestas: "media",
  formatoEstricto: true,

  erroresTecnicos: false,
  timeoutIA: 30000
})

function cambiarSeccion(id) {
  seccionActiva.value = id
  menuAbierto.value = false
}

function guardarAjustes() {
  localStorage.setItem("ajustesApp", JSON.stringify(ajustes.value))
}
</script>
