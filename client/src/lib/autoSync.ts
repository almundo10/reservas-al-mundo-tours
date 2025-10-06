import { saveReservationToSupabase } from './reservations'

// Intercepta localStorage.setItem y, si parece una reserva, la sube a Supabase
(function attachAutoSync() {
  if (typeof window === 'undefined') return
  const originalSetItem = window.localStorage.setItem.bind(window.localStorage)

  window.localStorage.setItem = function (key: string, value: string) {
    // Guardar en local como siempre
    originalSetItem(key, value)

    try {
      const parsed = JSON.parse(value)

      const looksLikeReservation =
        parsed && (parsed.fecha_inicio || parsed.start_date || parsed.destino || parsed.title)

      const looksLikeArray =
        Array.isArray(parsed) &&
        parsed.some(r => r?.fecha_inicio || r?.start_date || r?.destino || r?.title)

      if (looksLikeReservation) {
        saveReservationToSupabase(parsed).catch(() => {})
      } else if (looksLikeArray) {
        for (const r of parsed) saveReservationToSupabase(r).catch(() => {})
      }
    } catch {
      // no era JSON; no pasa nada
    }
  }
})();
