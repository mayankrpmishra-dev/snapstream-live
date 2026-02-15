"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Apna secret password yahan set karein
  const handleLogin = () => {
    if (password === "mayank@123") { // <--- Ye password badal lena
      setIsAdmin(true)
    } else {
      alert("Wrong Password!")
    }
  }

  const uploadPhoto = async (e: any) => {
    setUploading(true)
    const file = e.target.files[0]
    const fileName = `${Date.now()}-${file.name}`
    
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(fileName, file)

    if (error) alert("Upload fail ho gaya!")
    else alert("Photo Upload Ho Gayi!")
    setUploading(false)
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Mayank's Secret Admin Access</h2>
        <input 
          type="password" 
          placeholder="Enter Passcode"
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', color: 'black' }}
        />
        <button onClick={handleLogin} style={{ padding: '10px', marginLeft: '10px' }}>Login</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>Welcome Mayank! 📸</h1>
      <input type="file" onChange={uploadPhoto} disabled={uploading} />
      <p>{uploading ? "Uploading..." : "Select photo to upload"}</p>
      <a href="/">Go to Main Site</a>
    </div>
  )
}
