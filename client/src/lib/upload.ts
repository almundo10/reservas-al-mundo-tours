// client/src/lib/upload.ts
import { supabase } from './supabaseClient'

export async function uploadPhotos(files: File[], code: string) {
  const urls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `reservas/${code}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase
      .storage
      .from('reservas')
      .upload(path, file, { upsert: false })

    if (error) throw error

    const { data } = supabase.storage.from('reservas').getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return urls
}
