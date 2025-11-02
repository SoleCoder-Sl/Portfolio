'use client'

import { useAuth } from '@/context/AuthContext'

export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Upload } from 'lucide-react'

// Main component
export default function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // States for password
  const [newPassword, setNewPassword] = useState('')
  
  // States for notifications
  const [message, setMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '')
      setAvatarUrl(user.user_metadata?.avatar_url || null)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [user])

  // Handle Avatar Upload
  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user || !event.target.files || event.target.files.length === 0) {
      return
    }

    setLoading(true)
    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${new Date().getTime()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars') // Make sure this 'avatars' bucket exists in Supabase
      .upload(filePath, file)

    if (uploadError) {
      setMessage('Error uploading avatar: ' + uploadError.message)
      setLoading(false)
      return
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)
      
    const publicUrl = data.publicUrl

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl, full_name: fullName },
    })

    if (updateError) {
      setMessage('Error updating profile: ' + updateError.message)
    } else {
      setAvatarUrl(publicUrl)
      setMessage('Profile updated successfully!')
    }
    setLoading(false)
  }

  // Handle Profile Update (Name)
  async function handleProfileUpdate(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    })

    if (error) {
      setMessage('Error updating name: ' + error.message)
    } else {
      setMessage('Name updated successfully!')
    }
    setLoading(false)
  }
  
  // Handle Password Update
  async function handlePasswordUpdate(event: React.FormEvent) {
    event.preventDefault()
    if (!user || !newPassword) {
      setPasswordMessage('Password cannot be empty.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setPasswordMessage('')
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setPasswordMessage('Error updating password: ' + error.message)
    } else {
      setPasswordMessage('Password updated successfully!')
      setNewPassword('') // Clear the field
    }
    setLoading(false)
  }

  if (loading && !user) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Please sign in</h1>
          <p className="text-gray-300">You need to be signed in to view your profile.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen p-8 md:p-12">
      <h1 className="mb-10 text-center text-5xl font-bold text-white tracking-tight drop-shadow-lg">
        Account Settings
      </h1>

      {message && (
        <div className="mb-4 mx-auto max-w-2xl text-center">
          <p className={`p-3 rounded-lg ${
            message.includes('Error') 
              ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
              : 'bg-green-500/20 text-green-300 border border-green-500/50'
          }`}>
            {message}
          </p>
        </div>
      )}

      {/* --- Card 1: Profile --- */}
      <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-white/20 bg-black/30 p-8 shadow-2xl backdrop-blur-lg">
        <h2 className="mb-6 text-3xl font-bold text-white">
          Public Profile
        </h2>
        
        {/* --- Avatar --- */}
        <div className="mb-6 flex items-center gap-6">
          <div className="relative">
            <Image
              src={avatarUrl || '/img/Gemini_Generated_Image_emj8avemj8avemj8.png'}
              alt="Avatar"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
            />
          </div>
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload New Avatar
          </label>
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={loading}
          />
        </div>

        {/* --- Profile Form --- */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Email (Read-only)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full rounded-lg border border-white/10 bg-black/50 p-3 text-gray-400 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-md transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* --- Card 2: Security --- */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/20 bg-black/30 p-8 shadow-2xl backdrop-blur-lg">
        <h2 className="mb-6 text-3xl font-bold text-white">
          Security
        </h2>
        
        {passwordMessage && (
          <div className="mb-4">
            <p className={`p-3 rounded-lg text-center ${
              passwordMessage.includes('Error') 
                ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
                : 'bg-green-500/20 text-green-300 border border-green-500/50'
            }`}>
              {passwordMessage}
            </p>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 6 characters)"
              className="w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !newPassword}
            className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </section>
  )
}

