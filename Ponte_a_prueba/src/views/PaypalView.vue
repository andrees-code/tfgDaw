<template>
  <div class="min-h-screen flex flex-col bg-[#F5F7FA] font-sans">
    <Header />

    <main class="flex-grow flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Pago Seguro</h2>

        <div class="flex justify-center mt-6">
          <div id="paypal-container-HLYPPV8WCQJBQ"></div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from '@/components/HeaderCompleto.vue'

// Constantes extraídas de tu código nuevo
const HOSTED_BUTTON_ID = "HLYPPV8WCQJBQ"
const CONTAINER_ID = "paypal-container-HLYPPV8WCQJBQ"
const CLIENT_ID = "BAAZL_DEjvH0pr4P3hPtGmprYpTrTHv5KPoRaHIu17E7fEPDB6h2hmrKgMSH4nmphd9WciIrT3DaXPfUdY"

onMounted(() => {
  // 1. Verificamos si el script ya existe en el head
  if (!document.getElementById('paypal-sdk')) {
    const script = document.createElement('script')
    script.id = 'paypal-sdk'
    // URL exacta de tu "Parte 1"
    script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=EUR`
    script.async = true
    script.onload = () => renderPaypalButton()
    document.head.appendChild(script) // PayPal recomienda ponerlo en head o body top
  } else {
    // Si ya existe, intentamos renderizar directamente
    renderPaypalButton()
  }
})

function renderPaypalButton() {
  // Verificamos que PayPal esté cargado y que el contenedor exista
  const container = document.getElementById(CONTAINER_ID)

  if (window.paypal && window.paypal.HostedButtons && container) {
    // LIMPIEZA: Borramos contenido previo para evitar botones duplicados o errores
    container.innerHTML = ""

    window.paypal.HostedButtons({
      hostedButtonId: HOSTED_BUTTON_ID,
    }).render("#" + CONTAINER_ID)
  } else if (!window.paypal) {
    // Si el script existe pero window.paypal aun no está listo, reintentamos en 100ms
    setTimeout(renderPaypalButton, 100)
  }
}
</script>

<style scoped>
/* Aseguramos que el contenedor específico tenga el ancho correcto */
#paypal-container-HLYPPV8WCQJBQ {
  width: 100%;
  max-width: 300px;
  margin: 0 auto; /* Centrado */
  min-height: 50px; /* Evita saltos de diseño */
}
</style>
