<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-300 bg-slate-950 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] opacity-60 animate-blob mix-blend-screen"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000 mix-blend-screen"></div>
    </div>

    <Header class="relative z-20" />

    <main class="flex-grow flex justify-center items-center p-4 relative z-10">

      <div class="w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl shadow-indigo-500/10 p-8 md:p-12 text-center relative overflow-hidden animate-fade-in-up">

        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70"></div>

        <div class="flex justify-center mb-8 relative">
          <div class="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
          <img
            class="w-24 h-auto relative z-10 animate-float drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            src="../assets/logo/prueba2.webp"
            alt="Logo"
          />
        </div>

        <h1 class="text-7xl md:text-9xl font-black mb-2 tracking-tighter drop-shadow-2xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-400">404</span>
        </h1>

        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          Página no encontrada
        </h2>

        <p class="text-slate-400 mb-10 text-lg leading-relaxed max-w-md mx-auto">
          Parece que te has perdido en el espacio. La página que buscas no existe o ha sido movida.
        </p>

        <router-link
          to="/"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 group"
        >
          <i class="fa-solid fa-house text-indigo-200 group-hover:text-white transition-colors"></i>
          Volver al inicio
        </router-link>

      </div>
    </main>

    <Footer class="relative z-20" />
  </div>
</template>

<script setup>
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
</script>

<style scoped>
/* Grid Pattern */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animaciones */
.animate-blob {
  animation: blob 7s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
