/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // ✅ Esto conecta con la fuente que cargamos en index.html
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  // ✅ Optimización para móviles (evita cargar estilos hover en pantallas táctiles)
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
}