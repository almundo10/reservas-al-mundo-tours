import { supabase } from './supabaseClient';

// Sube una foto y devuelve URL pública
export async function uploadPhoto(file: File) {
  const path = `reservas/${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from('reservas').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('reservas').getPublicUrl(path);
  return data.publicUrl;
}

// Sube muchas fotos
export async function uploadMany(files: File[]) {
  const urls: string[] = [];
  for (const f of files) urls.push(await uploadPhoto(f));
  return urls;
}

type Base = {
  code: string;
  title?: string;
  customer_name: string;
  start_date?: string; // 'YYYY-MM-DD'
  end_date?: string;
};

// Guarda la reserva en la tabla 'reservations'
export async function saveReservation(base: Base, photoUrls: string[], payload: any) {
  const { error } = await supabase.from('reservations').insert({
    ...base,
    photo_urls: photoUrls,
    payload,
  });
  if (error) throw error;
}

// Lista para “Reservas Guardadas”
export async function listReservations() {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, created_at, code, title, customer_name, start_date, end_date, photo_urls')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Carga una reserva para rearmar el documento
export async function getReservationById(id: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Elimina una reserva
export async function deleteReservation(id: string) {
  const { error } = await supabase.from('reservations').delete().eq('id', id);
  if (error) throw error;
}
