"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(false) // Secret Admin Mode

  const fetchImages = async () => {
    const { data } = await supabase.storage.from('event-media').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (data) setImages(data)
  }

  useEffect(() => {
    fetchImages()
    // Secret: Agar URL mein '?admin=true' likhoge toh delete button dikhenge
    if (window.location.search.includes('admin=true')) {
      setIsAdmin(true)
    }
  }, [])

  const handleUpload = async (e: any) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return
      const fileName = `${Date.now()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('event-media').upload(fileName, file)
      if (error) throw error
      fetchImages()
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (name: string) => {
    if (confirm("Kya aap sach mein ye photo delete karna chahte hain?")) {
      const { error } = await supabase.storage.from('event-media').remove([name])
      if (error) alert("Delete nahi ho paya")
      else fetchImages()
    }
  }

  const downloadImage = async (name: string) => {
    const { data } = await supabase.storage.from('event-media').getPublicUrl(name)
    const response = await fetch(data.publicUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `snapstream-${name}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="main-wrapper">
      <style jsx>{`
        .main-wrapper { background: #050505; color: #fff; min-height: 100vh; padding: 40px 20px; font-family: sans-serif; }
        header { text-align: center; margin-bottom: 50px; }
        .logo { font-size: 3.5rem; font-weight: 900; background: linear-gradient(to bottom, #fff, #666); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
        .tagline { color: #D4AF37; letter-spacing: 5px; font-size: 0.8rem; font-weight: bold; }
        
        .upload-btn { 
          display: inline-block; margin-top: 30px; background: #fff; color: #000; 
          padding: 15px 35px; border-radius: 50px; font-weight: bold; cursor: pointer;
        }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1400px; margin: 0 auto; }
        
        .card { position: relative; border-radius: 15px; overflow: hidden; aspect-ratio: 4/5; background: #111; border: 1px solid #222; }
        img { width: 100%; height: 100%; object-fit: cover; }

        .overlay {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 15px;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          display: flex; justify-content: space-between; align-items: center;
          opacity: 0; transition: 0.3s;
        }
        .card:hover .overlay { opacity: 1; }

        .btn-icon { background: rgba(255,255,255,0.2); border: none; color: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; backdrop-filter: blur(5px); }
        .delete-btn { background: rgba(255, 0, 0, 0.6); }

        @media (max-width: 600px) { 
          .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } 
          .overlay { opacity: 1; background: none; } /* Mobile par buttons humesha dikhenge */
        }
      `}</style>
        
        

      <header>
        <h1 className="logo">SnapStream</h1>
        <p className="tagline">CINEMATIC WITH MAYANK</p>
        <label className="upload-btn">
          {uploading ? 'UPLOADING...' : '📸 UPLOAD'}
          <input type="file" onChange={handleUpload} disabled={uploading} hidden accept="image/*" />
        </label>
      </header>

      <div className="grid">
        {images.map((img) => (
          <div key={img.id} className="card">
            <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-media/${img.name}`} alt="Moment" />
            
            <div className="overlay">
              <button className="btn-icon" onClick={() => downloadImage(img.name)}>⬇ Download</button>
              {isAdmin && (
                <button className="btn-icon delete-btn" onClick={() => deleteImage(img.name)}>🗑 Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}