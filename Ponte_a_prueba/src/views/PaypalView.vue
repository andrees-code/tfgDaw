<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC] font-sans relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>

    <Header />

    <main class="flex-grow flex items-center justify-center p-4 lg:p-8">
      <div class="w-full max-w-2xl relative">

        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 p-8 md:p-10 text-center relative z-10 grid grid-cols-1 justify-center">

          <div class="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <i class="fa-solid fa-heart text-3xl text-white"></i>
          </div>

          <h2 class="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Zona de Donación</h2>

          <div class="relative min-h-[200px] bg-slate-50 rounded-2xl border  p-6 md:p-8 ">

            <div v-if="loading" class="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-50 rounded-2xl">
              <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <p class="text-xs text-slate-400 font-medium animate-pulse">Cargando pasarela segura...</p>
            </div>

            <div :class="{'opacity-0': loading, 'opacity-100': !loading}" class="transition-opacity duration-500 z-10 w-full flex justify-center">

               <div :id="CONTAINER_ID" class="paypal-clean-container"></div>

            </div>

          </div>

          <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transacción asegurada por</p>
            <div class="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <i class="fab fa-cc-paypal text-3xl text-[#003087]"></i>
              <i class="fab fa-cc-visa text-3xl text-[#1A1F71]"></i>
              <i class="fab fa-cc-mastercard text-3xl text-[#EB001B]"></i>
            </div>
          </div>

        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'

const loading = ref(true)

const HOSTED_BUTTON_ID = "HLYPPV8WCQJBQ"
const CONTAINER_ID = "paypal-container-HLYPPV8WCQJBQ"
const CLIENT_ID = "BAAZL_DEjvH0pr4P3hPtGmprYpTrTHv5KPoRaHIu17E7fEPDB6h2hmrKgMSH4nmphd9WciIrT3DaXPfUdY"

onMounted(() => {
  if (!document.getElementById('paypal-sdk')) {
    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=EUR`
    script.async = true
    script.onload = () => renderPaypalButton()
    document.head.appendChild(script)
  } else {
    renderPaypalButton()
  }
})

function renderPaypalButton() {
  const container = document.getElementById(CONTAINER_ID)

  if (window.paypal && window.paypal.HostedButtons && container) {
    container.innerHTML = ""
    try {
      window.paypal.HostedButtons({
        hostedButtonId: HOSTED_BUTTON_ID,
      }).render("#" + CONTAINER_ID).then(() => {
        loading.value = false
      })
    } catch (error) {
      console.error("Error rendering PayPal:", error)
    }
  } else if (!window.paypal) {
    setTimeout(renderPaypalButton, 100)
  }
}
</script>

<style scoped>
/* ESTILOS DE PROTECCIÓN */
.paypal-clean-container {
  /* 1. Ancho máximo para que no se desparrame, pero suficiente para el texto */
  width: 100%;
  max-width: 400px;
  /* 2. Comportamiento de bloque normal (NO FLEX) */
  display: block;
  /* 3. Centrado del texto interno si PayPal lo permite */
  text-align: center;
}

/* 4. Forzamos reglas profundas para evitar el "letra por letra" */
:deep(.paypal-button-container) {
  width: 100% !important;
  max-width: 100% !important;
}

/* Esta regla fuerza a que cualquier texto inyectado tenga espacio normal */
:deep(*) {
  white-space: normal !important;
  word-wrap: break-word !important;
}

main {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
