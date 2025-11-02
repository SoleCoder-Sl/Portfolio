'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function AvatarSelector() {
  const router = useRouter()
  const [position, setPosition] = useState({ x: 50, y: 50 }) // Percentage values
  const [scale, setScale] = useState(85) // Scale percentage
  const [isDragging, setIsDragging] = useState(false)

  const circleSize = 160 // Match the avatar size (w-40 h-40 = 160px)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Clamp values to keep circle within bounds
    const circleRadiusPercent = (circleSize / 2 / rect.width) * 100
    const clampedX = Math.max(circleRadiusPercent, Math.min(100 - circleRadiusPercent, 50)) // Keep centered horizontally
    const clampedY = Math.max(circleRadiusPercent, Math.min(100 - circleRadiusPercent, y)) // Allow vertical movement
    
    setPosition({ x: 50, y: clampedY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -5 : 5
    setScale(prev => Math.max(60, Math.min(120, prev + delta)))
  }

  const applySettings = () => {
    // Save to localStorage or update the About page
    const settings = {
      objectPosition: `center ${position.y}%`,
      scale: scale
    }
    localStorage.setItem('avatarSettings', JSON.stringify(settings))
    alert(`Settings saved!\nPosition: center ${position.y}%\nScale: ${scale}%\n\nNow updating the About page...`)
    router.push('/about')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-custom-gradient">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Avatar Position Selector
          </h1>
          <p className="text-gray-200 drop-shadow-md">
            Drag the circle to position | Scroll to zoom | Click "Apply" when done
          </p>
        </div>

        {/* Main Selector Area */}
        <div className="relative bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <div
            className="relative w-full aspect-square max-w-2xl mx-auto cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* Full Image */}
            <Image
              src="/img/Gemini_Generated_Image_emj8avemj8avemj8.png"
              alt="Full Image"
              width={800}
              height={800}
              className="w-full h-full object-contain rounded-lg"
              priority
            />

            {/* Circular Selector Overlay */}
            <div
              className="absolute border-4 border-blue-500 rounded-full shadow-2xl pointer-events-none"
              style={{
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                left: `calc(${position.x}% - ${circleSize / 2}px)`,
                top: `calc(${position.y}% - ${circleSize / 2}px)`,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), inset 0 0 20px rgba(59, 130, 246, 0.3)',
              }}
            >
              {/* Crosshair center */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 opacity-50"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-blue-500 opacity-50"></div>
            </div>

            {/* Dimmed overlay outside circle */}
            <div
              className="absolute inset-0 bg-black/40 rounded-lg pointer-events-none"
              style={{
                clipPath: `circle(${circleSize / 2}px at ${position.x}% ${position.y}%)`,
                WebkitClipPath: `circle(${circleSize / 2}px at ${position.x}% ${position.y}%)`,
              }}
            />
          </div>

          {/* Preview */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4 drop-shadow-md">Preview:</h3>
            <div className="inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg shadow-white/20 border-4 border-white/20 relative bg-white/5">
                <Image
                  src="/img/Gemini_Generated_Image_emj8avemj8avemj8.png"
                  alt="Preview"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `center ${position.y}%`,
                    transform: `scale(${scale / 100})`,
                  }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 space-y-4">
            {/* Position Info */}
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Vertical Position</p>
                  <p className="text-lg font-semibold">{position.y.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300 mb-1">Zoom Level</p>
                  <p className="text-lg font-semibold">{scale}%</p>
                </div>
              </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white mb-2">
                Zoom: {scale}%
              </label>
              <input
                type="range"
                min="60"
                max="120"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Vertical Position Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white mb-2">
                Vertical Position: {position.y.toFixed(1)}%
              </label>
              <input
                type="range"
                min="30"
                max="70"
                step="0.5"
                value={position.y}
                onChange={(e) => setPosition({ ...position, y: Number(e.target.value) })}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Apply Button */}
            <button
              onClick={applySettings}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Apply These Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

