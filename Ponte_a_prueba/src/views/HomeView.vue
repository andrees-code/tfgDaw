<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-300 bg-slate-950 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">

      <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] opacity-70 mix-blend-screen will-change-transform"></div>

      <div class="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[80px] opacity-60 animate-blob mix-blend-screen will-change-transform"></div>
      <div class="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[80px] opacity-60 animate-blob animation-delay-2000 mix-blend-screen will-change-transform"></div>

      <div class="hidden lg:block absolute top-[20%] left-[5%] animate-float opacity-30 will-change-transform">
        <div class="w-20 h-28 bg-slate-800/80 border border-white/10 rounded-xl shadow-2xl -rotate-12 flex items-center justify-center backdrop-blur-sm">
            <i class="fa-solid fa-file-lines text-3xl text-indigo-400" aria-hidden="true"></i>
        </div>
      </div>

      <div class="hidden lg:block absolute top-[30%] right-[8%] animate-float animation-delay-1000 opacity-30 will-change-transform">
        <div class="w-20 h-20 bg-slate-800/80 border border-white/10 rounded-2xl shadow-2xl rotate-12 flex items-center justify-center backdrop-blur-sm">
            <i class="fa-solid fa-graduation-cap text-3xl text-purple-400" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <Header class="relative z-20" />

    <main class="flex-grow w-full mx-auto max-w-5xl px-4 py-8 md:py-12 relative z-10">
      <div class="animate-fade-in-up">

        <div class="text-center mb-10 relative">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -z-10"></div>

          <span class="inline-block py-1.5 px-4 rounded-full bg-slate-800/50 backdrop-blur-sm text-indigo-300 text-xs font-bold tracking-wider uppercase mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-900/20">
              ✨ Herramienta IA Potenciada
          </span>
          <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 flex flex-col md:block items-center justify-center gap-2 drop-shadow-lg">
            Generador de
            <span class="relative inline-block">
               <span class="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Exámenes</span>
               <svg class="absolute w-full h-3 -bottom-1 left-0 text-indigo-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" /></svg>

               <span class="absolute -top-2 -right-4 flex h-4 w-4 cursor-pointer" role="button" aria-label="Nueva funcionalidad disponible" @click="irAlModoReto" title="Nueva funcionalidad disponible">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border-2 border-slate-900"></span>
              </span>
            </span>
          </h1>
          <p class="text-slate-300 max-w-xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
            {{ categoriaActiva.descripcion }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Categoría de examen">
          <button
            v-for="cat in CATEGORIAS"
            :key="cat.id"
            type="button"
            role="tab"
            :aria-selected="categoriaActiva.id === cat.id"
            @click="categoriaActivaId = cat.id"
            :class="['flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all border', categoriaActiva.id === cat.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30 scale-[1.03]' : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20']"
          >
            <i :class="cat.icon" aria-hidden="true"></i>
            {{ cat.label }}
          </button>
        </div>

        <ExamGeneratorPanel :key="categoriaActiva.id" :categoria="categoriaActiva" />

      </div>
    </main>

    <Transition name="slide-fade">
        <div v-if="mostrarNovedad" class="fixed bottom-6 right-4 md:right-8 z-50 w-full max-w-sm">
             <div class="relative bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] border border-white/10 ring-1 ring-white/5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer" @click="irAlModoReto">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                <button @click.stop="cerrarNovedad" aria-label="Cerrar aviso de novedad" class="absolute top-2 right-2 p-2 text-slate-500 hover:text-slate-300 z-10 transition-colors"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
                <div class="flex gap-4 items-start relative z-10">
                    <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <i class="fa-solid fa-fire text-xl animate-pulse" aria-hidden="true"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h2 class="font-bold text-slate-200 text-sm md:text-base">Nuevo: Modo Reto</h2>
                            <span class="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-wide border border-pink-500/20">Beta</span>
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed mb-3">¡Aprende jugando! Elige una categoría o un tema y ponte a prueba.</p>
                        <button class="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">Probar ahora <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    </Transition>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
import ExamGeneratorPanel from '@/components/exams/ExamGeneratorPanel.vue'
import { CATEGORIAS, getCategoria } from '@/config/categorias'
import { userStore } from "@/stores/userStores"

const router = useRouter()
const mostrarNovedad = ref(false)
const categoriaActivaId = ref('general')
const categoriaActiva = computed(() => getCategoria(categoriaActivaId.value))

onMounted(() => {
  userStore.loadSession()

  // ✅ OPTIMIZACIÓN #7: Añadir Meta Description y Title dinámicamente
  document.title = "Generador de Exámenes IA - Crea Tests Automáticos";
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Convierte apuntes y PDFs en exámenes y tests automáticamente con nuestra IA. Genera exámenes de carnet de conducir, programación, oposiciones a policía o de tus propios apuntes.";


  setTimeout(() => {
    const yaVisto = localStorage.getItem('novedad_reto_visto')
    if (!yaVisto) {
      mostrarNovedad.value = true
    }
  }, 2000)
})

function cerrarNovedad() {
    mostrarNovedad.value = false
    localStorage.setItem('novedad_reto_visto', 'true')
}

function irAlModoReto() {
    router.push('/modotinder')
}
</script>

<style scoped>
/* Patrón de cuadrícula técnica (Grid Blanco) */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animación de flotación */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

/* Animaciones Generales */
.animate-blob {
  animation: blob 10s infinite alternate;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from {
  transform: translateX(20px) translateY(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Optimización GPU para fondos */
.will-change-transform {
    will-change: transform;
}

/* Keyframes */
@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
