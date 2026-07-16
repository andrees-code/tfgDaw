// URL base de la API del backend.
// En desarrollo (npm run dev / vite) apunta al backend local; en producción
// (build de Vite) apunta al backend desplegado. Se puede forzar con VITE_API_URL.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:3000/api/api'
    : 'https://bakend-murex.vercel.app/api/api')
