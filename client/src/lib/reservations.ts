// client/src/lib/reservations.ts
import { supabase } from './supabaseClient'

export type Reservation = {
  code: string           // Ej: ALXXXX
  title: string          // Título de la reserva
  customer_name: string  // Responsable
  start_date: string     // yyyy-mm-dd
  end_date: string       // yyyy-mm-dd
  photo_urls: string[]   // URLs públicas de Storage
}

export async function saveReservation(r: Reservation) {
  const { error } = await supabase
    .from('reservations')
    .insert(r)
  if (error) throw error
}
