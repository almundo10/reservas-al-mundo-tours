// src/lib/autoSync.ts
import { saveReservationToSupabase } from './reservations'

/**
 * Envuelve localStorage.setItem para interceptar escrituras de la app.
 * Si el valor es JSON y parece una "reserva", la sube a Supabase en paralelo.
 */
(function attachAutoSync() {
  if (typeof window === 'undefined') return
  const originalSetItem = window.localStorage.setItem.bind(window.localStorage)

  window.localStorage.setItem = function (key: string, value: string) {
    try {
      // 1) Guardar como siempre en local
      originalSetItem(key, value)

      // 2) Intentar parsear y detectar "reserva(s)"
      const parsed = JSON.parse(value)

      // Caso A: un objeto con campos típicos
      const looksLikeReservationObject =
        parsed && (parsed.fecha_inicio || parsed.start_date || parsed.destino || parsed.title)

      // Caso B: un array de objetos (varias reservas)
      const looksLikeArray =
        Array.isArray(parsed) && parsed.some((r) => r?.fecha_inicio || r?.start_date || r?.destino || r?.title)

      if (looksLikeReservationObject) {
        saveReservationToSupabase(parsed).catch((e) =>
          console.warn('[AUTO-SYNC] No se pudo subir la reserva:', e?.message || e)
        )
      } else if (looksLikeArray) {
        // Sube cada una (simple, sin esperar a todas)
        for (const r of parsed) {
          saveReservationToSupabase(r).catch((e) =>
            console.warn('[AUTO-SYNC] No se pudo subir una reserva del array:', e?.message || e)
          )
        }
      }
    } catch {
      // Si no es JSON o hay error, no pasa nada: se guarda en local igual
    }
  };
})();
