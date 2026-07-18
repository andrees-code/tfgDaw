<template>
  <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-950" aria-hidden="true">

    <!-- ═══ CARNET DE CONDUCIR — aurora ámbar ═══ -->
    <template v-if="backdrop === 'carretera'">
      <div class="abs mesh-carretera"></div>
      <div class="abs dotgrid dotgrid-amber"></div>
      <div class="aurora aurora-amber-1"></div>
      <div class="aurora aurora-amber-2"></div>
      <div class="abs vignette"></div>
    </template>

    <!-- ═══ PROGRAMACIÓN — malla mono + lluvia tenue, esmeralda ═══ -->
    <template v-else-if="backdrop === 'terminal'">
      <div class="abs mesh-terminal"></div>
      <div class="abs dotgrid dotgrid-emerald"></div>
      <!-- Columnas de dígitos muy tenues -->
      <div class="rain">
        <span v-for="c in rainCols" :key="c.i" class="rain-col" :style="c.style">{{ c.text }}</span>
      </div>
      <div class="abs" style="background: radial-gradient(80% 60% at 82% 12%, rgba(16,185,129,0.10), transparent 60%)"></div>
      <div class="abs vignette"></div>
    </template>

    <!-- ═══ OPOSICIONES POLICÍA — aurora azul ═══ -->
    <template v-else-if="backdrop === 'policia'">
      <div class="abs mesh-policia"></div>
      <div class="abs dotgrid dotgrid-blue"></div>
      <div class="aurora aurora-blue-1"></div>
      <div class="aurora aurora-blue-2"></div>
      <div class="abs vignette"></div>
    </template>

    <!-- ═══ GENERAL — aurora índigo ═══ -->
    <template v-else>
      <div class="abs mesh-general"></div>
      <div class="abs dotgrid dotgrid-indigo"></div>
      <div class="aurora aurora-1"></div>
      <div class="aurora aurora-2"></div>
      <div class="abs vignette"></div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getTheme } from '@/config/categorias'

const props = defineProps({
  categoriaId: { type: String, default: 'general' },
})

const backdrop = computed(() => getTheme(props.categoriaId).backdrop)

// Columnas de "lluvia de código" para la temática de programación.
// Se generan una vez; posiciones/retardos fijos para que no salten.
const glyphs = '01</>{}=;()[]#$&|+*'
const rainCols = Array.from({ length: 14 }, (_, i) => {
  const text = Array.from({ length: 26 }, () => glyphs[Math.floor(Math.random() * glyphs.length)]).join('\n')
  return {
    i,
    text,
    style: {
      left: `${(i / 14) * 100 + Math.random() * 3}%`,
      animationDuration: `${9 + Math.random() * 9}s`,
      animationDelay: `${-Math.random() * 12}s`,
      opacity: 0.05 + Math.random() * 0.05,
      fontSize: `${11 + Math.random() * 3}px`,
    },
  }
})
</script>

<style scoped>
.abs { position: absolute; inset: 0; }

/* ── Texturas compartidas ── */
.vignette {
  background: radial-gradient(ellipse 78% 74% at 50% 42%, transparent 55%, rgba(0,0,0,0.55) 100%);
}
.dotgrid {
  background-image: radial-gradient(currentColor 1px, transparent 1px);
  background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 45%, #000 40%, transparent 80%);
          mask-image: radial-gradient(ellipse 70% 70% at 50% 45%, #000 40%, transparent 80%);
}
.dotgrid-emerald { color: rgba(16,185,129,0.16); }
.dotgrid-indigo  { color: rgba(129,140,248,0.14); }
.dotgrid-amber   { color: rgba(251,191,36,0.15); }
.dotgrid-blue    { color: rgba(96,165,250,0.14); }

/* ── Mesh gradients por tema (varios radiales superpuestos) ── */
.mesh-carretera {
  background:
    radial-gradient(60% 50% at 20% 18%, rgba(120,53,15,0.55), transparent 60%),
    radial-gradient(55% 45% at 85% 25%, rgba(146,64,14,0.40), transparent 60%),
    radial-gradient(90% 60% at 50% 108%, rgba(245,158,11,0.20), transparent 65%),
    linear-gradient(to bottom, #0a0a0f, #0c0a08);
}
.mesh-terminal {
  background:
    radial-gradient(55% 50% at 78% 12%, rgba(6,78,59,0.55), transparent 60%),
    radial-gradient(50% 45% at 12% 88%, rgba(6,95,70,0.35), transparent 60%),
    linear-gradient(to bottom, #06090c, #070d0b);
}
.mesh-policia {
  background:
    radial-gradient(60% 50% at 50% -10%, rgba(30,58,138,0.55), transparent 60%),
    radial-gradient(50% 45% at 12% 95%, rgba(29,78,216,0.30), transparent 60%),
    radial-gradient(50% 45% at 90% 100%, rgba(120,20,20,0.22), transparent 60%),
    linear-gradient(to bottom, #04070f, #060a16);
}
.mesh-general {
  background:
    radial-gradient(55% 50% at 18% 16%, rgba(49,46,129,0.55), transparent 60%),
    radial-gradient(55% 50% at 84% 30%, rgba(76,29,149,0.45), transparent 60%),
    radial-gradient(70% 55% at 55% 105%, rgba(37,99,235,0.25), transparent 65%),
    linear-gradient(to bottom, #060713, #080a18);
}

/* ── Programación: lluvia de código ── */
.rain { position: absolute; inset: -10% 0 0 0; }
.rain-col {
  position: absolute; top: -30%;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  line-height: 1.35;
  white-space: pre;
  color: #34d399;
  text-shadow: 0 0 6px rgba(16,185,129,0.4);
  animation-name: rainFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* ── Aurora (general, carnet, policía) ── */
.aurora {
  position: absolute; border-radius: 50%;
  filter: blur(70px);
  mix-blend-mode: screen;
  opacity: 0.5;
}
.aurora-1 {
  width: 46vmax; height: 46vmax; left: -8%; top: 4%;
  background: radial-gradient(circle, rgba(99,102,241,0.5), transparent 68%);
  animation: drift1 20s ease-in-out infinite alternate;
}
.aurora-2 {
  width: 52vmax; height: 52vmax; right: -10%; bottom: -6%;
  background: radial-gradient(circle, rgba(147,51,234,0.42), transparent 68%);
  animation: drift2 26s ease-in-out infinite alternate;
}
.aurora-amber-1 {
  width: 46vmax; height: 46vmax; left: -8%; top: 4%;
  background: radial-gradient(circle, rgba(245,158,11,0.42), transparent 68%);
  animation: drift1 20s ease-in-out infinite alternate;
}
.aurora-amber-2 {
  width: 52vmax; height: 52vmax; right: -10%; bottom: -6%;
  background: radial-gradient(circle, rgba(217,119,6,0.38), transparent 68%);
  animation: drift2 26s ease-in-out infinite alternate;
}
.aurora-blue-1 {
  width: 46vmax; height: 46vmax; left: -8%; top: 4%;
  background: radial-gradient(circle, rgba(37,99,235,0.46), transparent 68%);
  animation: drift1 20s ease-in-out infinite alternate;
}
.aurora-blue-2 {
  width: 52vmax; height: 52vmax; right: -10%; bottom: -6%;
  background: radial-gradient(circle, rgba(14,165,233,0.36), transparent 68%);
  animation: drift2 26s ease-in-out infinite alternate;
}

@keyframes rainFall {
  from { transform: translateY(0); }
  to   { transform: translateY(130vh); }
}
@keyframes drift1 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(14vw, 8vh) scale(1.12); }
}
@keyframes drift2 {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(-12vw,-6vh) scale(1.1); }
}

@media (prefers-reduced-motion: reduce) {
  .rain-col,
  .aurora-1, .aurora-2,
  .aurora-amber-1, .aurora-amber-2,
  .aurora-blue-1, .aurora-blue-2 { animation: none; }
}
</style>
