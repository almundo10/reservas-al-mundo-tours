import { supabase } from './supabaseClient'

export type ReservationRow = {
  code?: string | null
  title?: string | null
  customer_name?: string | null
  start_date?: string | null
  end_date?: string | null
  photo_urls?: string[] | null
  payload?: any
}

export function mapAnyToReservation(input: any): ReservationRow {
  const asStr = (v: any) => (v == null ? null : String(v))
  return {
    code: asStr(input?.code ?? input?.codigo ?? input?.id ?? input?.folio),
    title: asStr(input?.title ?? input?.titulo ?? input?.destino ?? input?.plan),
    customer_name: asStr(input?.customer_name ?? input?.cliente ?? input?.nombre ?? input?.contacto),
    start_date: asStr(input?.start_date ?? input?.fecha_inicio ?? input?.check_in),
    end_date: asStr(input?.end_date ?? input?.fecha_fin ?? input?.check_out),
    photo_urls: Array.isArray(input?.photo_urls) ? input.photo_urls : null,
    payload: input ?? null,
  }
}

export async function saveReservationToSupabase(anyObject: any) {
  const row = mapAnyToReservation(anyObject)
  const { error } = await supabase.from('reservations').insert(row)
  if (error) throw error
}
