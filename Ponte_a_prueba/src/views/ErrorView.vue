<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header />

    <main class="flex-grow flex justify-center items-center p-4">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 md:p-12 text-center">

        <!-- Logo -->
        <div class="flex justify-center mb-6">
          <img
            class="w-24 h-17"
            src="../assets/logo/prueba2.png"
            alt="Logo"
          />
        </div>

        <!-- 404 -->
        <h1 class="text-6xl md:text-7xl font-bold text-[#3978D7] mb-4">
          404
        </h1>

        <h2 class="text-xl md:text-2xl font-semibold text-[#546E7A] mb-3">
          Página no encontrada
        </h2>

        <p class="text-gray-500 mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>

        <!-- Acción -->
        <router-link
          to="/"
          class="inline-block bg-[#3978D7] hover:bg-[#2d62b3] text-white px-6 py-3 rounded-lg transition"
        >
          Volver al inicio
        </router-link>

      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
</script>
