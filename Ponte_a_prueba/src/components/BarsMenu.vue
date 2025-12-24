<template>
  <ul
    class="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
  >
    <li
      v-for="item in menu"
      :key="item.id"
      class="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer rounded-md"
    >
      <!-- Icono dinámico con Font Awesome -->
      <i :class="['fa-solid', `fa-${item.icon}`]"></i>
      <router-link
        :to="item.route"
        class="flex-1"
        @click="emit('cerrar')"
      >
        {{ item.label }}
      </router-link>
    </li>
  </ul>
</template>


<script setup>
 import { ref } from "vue";
 const emit = defineEmits(['cerrar'])

let menu = ref([
  {
    id: 1,
    label: "Inicio",
    route: "/",
    icon: "home",
  },
  {
    id: 2,
    label: "Ajustes",
    route: "/ajustes",
    icon: "gear",
  },
  {
    id: 3,
    label: "Contacto",
    route: "/contacto",
    icon: "envelope",
  },
  {
    id: 4,
    label: "Perfil",
    route: "/perfil",
    icon: "user",
  }
]);


</script>

<style lang="sass">
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
</style>
