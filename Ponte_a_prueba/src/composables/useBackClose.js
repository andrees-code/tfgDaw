import { onMounted, onBeforeUnmount, watch } from 'vue'

// Coordinador global del botón "atrás": mantiene una pila LIFO de overlays
// abiertos (modales, editor, menús) y un único sentinel en el historial.
// Mientras haya algo en la pila, "atrás" cierra el overlay superior en vez de
// cambiar de ruta; cuando la pila queda vacía, la navegación vuelve al router.
//
// Importante: aquí NUNCA se llama a history.back() al cerrar un overlay por UI
// (X, click fuera, click en un enlace). Ese back() competiría con un
// router.push lanzado en el mismo click (p.ej. enlace del menú que navega y
// cierra el menú a la vez) y desharía la navegación. El sentinel huérfano se
// reutiliza en el siguiente register o se atraviesa en onPopState.
const stack = []            // [{ handler }] — LIFO, el último es el tope
let armed = false           // creemos que el sentinel está en el tope del historial
let pendingBack = false     // hemos emitido history.back() y su popstate aún no llegó
let basePath = ''           // location cuando se armó el sentinel
let installed = false

const currentPath = () => location.pathname + location.search

function pushSentinel() {
  basePath = currentPath()
  // Spread de history.state: vue-router guarda ahí position/back/forward/scroll
  history.pushState({ ...history.state, backClose: true }, '')
  armed = true
}

function onPopState() {
  if (pendingBack) {                      // aterriza nuestro propio back()
    pendingBack = false
    if (stack.length) pushSentinel()      // re-armado diferido (hubo register en vuelo)
    return
  }
  if (!stack.length) {
    if (armed && currentPath() === basePath) {
      // Se acaba de consumir un sentinel huérfano (overlay cerrado por UI):
      // continuar el "atrás" real para que una sola pulsación navegue.
      armed = false
      pendingBack = true
      history.back()
    } else {
      armed = false                       // navegación real: cosa del router
    }
    return
  }
  if (currentPath() !== basePath) {
    // Salto multi-paso (dos atrás coalescidos, menú de historial): la URL ya
    // cambió de ruta, el router desmontará los overlays — retirarse.
    stack.length = 0
    armed = false
    return
  }
  const top = stack[stack.length - 1]
  const stillOpen = top.handler()         // truthy = consumido pero sigue abierto (p.ej. subir carpeta)
  if (!stillOpen) stack.pop()
  if (stack.length) pushSentinel()
  else armed = false                      // el sentinel lo consumió este mismo pop
}

export function registerBackClose(handler) {
  if (!installed) { window.addEventListener('popstate', onPopState); installed = true }
  const entry = { handler }
  stack.push(entry)
  if (!pendingBack) {
    if (history.state?.backClose === true) {
      // Sentinel huérfano de un overlay anterior en esta misma página: reutilizarlo
      armed = true
      basePath = currentPath()
    } else {
      pushSentinel()
    }
  }
  return function dispose() {
    const i = stack.indexOf(entry)
    if (i === -1) return                  // ya lo sacó onPopState — idempotente
    stack.splice(i, 1)
    if (stack.length) return              // el sentinel sigue sirviendo al resto
    // Pila vacía: no tocar el historial (ver nota de cabecera). Solo reconciliar
    // el flag: si el router ya empujó una entrada encima, el sentinel quedó
    // enterrado y deja de ser el tope.
    armed = history.state?.backClose === true
  }
}

// Overlays montados con v-if (modales/ventanas): su vida coincide con estar abiertos
export function useBackCloseOnMount(handler) {
  let dispose = null
  onMounted(() => { dispose = registerBackClose(handler) })
  onBeforeUnmount(() => { dispose?.(); dispose = null })
}

// Estado booleano de apertura dentro de un componente siempre montado
export function useBackCloseWhen(isOpen, handler) {
  let dispose = null
  watch(isOpen, open => {
    if (open && !dispose) dispose = registerBackClose(handler)
    else if (!open && dispose) { dispose(); dispose = null }
  }, { immediate: true })
  onBeforeUnmount(() => { dispose?.(); dispose = null })
}
