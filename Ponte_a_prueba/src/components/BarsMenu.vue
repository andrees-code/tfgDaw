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
    label: "Examenes",
    route: "/home",
    icon: "file-alt", // 📄 o "clipboard" para examenes
  },
  {
    id: 2,
    label: 'Biblioteca',
    route: '/biblioteca',
    icon: 'book', // 📚 correcto
  },
  {
    id: 3,
    label: 'Estudio',
    route: '/estudio',
    icon: 'graduation-cap', // 🎓 más representativo que "book"
  },
    {
    id: 4,
    label: "Contacto",
    route: "/contacto",
    icon: "envelope", // ✉️ ya está perfecto
  },
]);



</script>

<style lang="sass">
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
</style>
