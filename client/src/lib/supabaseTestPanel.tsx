// client/src/lib/supabaseTestPanel.tsx
import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { uploadPhotos } from './upload'
import { saveReservation } from './reservations'

function Panel() {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Campos simples
  const codeRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const startRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLInputElement>(null)
  const filesRef = useRef<HTMLInputElement>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const code = codeRef.current?.value?.trim() || ''
      const title = titleRef.current?.value?.trim() || ''
      const customer_name = nameRef.current?.value?.trim() || ''
      const start_date = startRef.current?.value || ''
      const end_date = endRef.current?.value || ''
      const files = Array.from(filesRef.current?.files ?? [])

      if (!code) throw new Error('Falta el código')
      if (!title) throw new Error('Falta el título')
      if (!customer_name) throw new Error('Falta el responsable')
      if (!start_date || !end_date) throw new Error('Faltan fechas')

      const photo_urls = files.length ? await uploadPhotos(files, code) : []
      await saveReservation({ code, title, customer_name, start_date, end_date, photo_urls })

      setMsg(`✅ Reserva guardada. Fotos: ${photo_urls.length}`)
      // Limpiar
      filesRef.current && (filesRef.current.value = '')
    } catch (err: any) {
      console.error(err)
      setMsg('❌ ' + (err?.message ?? String(err)))
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <div style={fabStyle} onClick={() => setOpen(true)} title="Abrir panel Supabase">🗂️</div>
    )
  }

  return (
    <div style={panelStyle}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <strong>Supabase Test</strong>
        <button onClick={() => setOpen(false)} style={btnSm}>×</button>
      </div>

      <form onSubmit={onSubmit} style={{display:'grid', gap:8}}>
        <input ref={codeRef} placeholder="Código (ej: ALXXXX)" style={input} />
        <input ref={titleRef} placeholder="Título / destino" style={input} />
        <input ref={nameRef} placeholder="Responsable" style={input} />
        <input ref={startRef} type="date" style={input} />
        <input ref={endRef} type="date" style={input} />
        <input ref={filesRef} type="file" multiple style={input} />
        <button disabled={loading} style={btnPrimary}>
          {loading ? 'Guardando...' : 'Guardar en Supabase'}
        </button>
      </form>

      {msg && <div style={{marginTop:8, fontSize:12}}>{msg}</div>}
    </div>
  )
}

/* estilos */
const panelStyle: React.CSSProperties = {
  position:'fixed', right:16, bottom:16, zIndex: 999999,
  width: 280, padding:12, borderRadius:8,
  background:'#111', color:'#fff', border:'1px solid #444',
  fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', fontSize:14
}
const fabStyle: React.CSSProperties = {
  position:'fixed', right:16, bottom:16, zIndex: 999999,
  width:48, height:48, borderRadius:24, background:'#111', color:'#fff',
  display:'grid', placeItems:'center', cursor:'pointer', border:'1px solid #444'
}
const input: React.CSSProperties = {
  padding:'8px 10px', borderRadius:6, border:'1px solid #555', background:'#222', color:'#fff'
}
const btnPrimary: React.CSSProperties = {
  padding:'8px 10px', borderRadius:6, border:'1px solid #666', background:'#2b6', color:'#000',
  cursor:'pointer', fontWeight:600
}
const btnSm: React.CSSProperties = {
  padding:'4px 8px', borderRadius:6, border:'1px solid #666', background:'#333', color:'#fff',
  cursor:'pointer'
}

/* Montar el panel */
const host = document.createElement('div')
document.body.appendChild(host)
createRoot(host).render(<Panel />)
