'use client'

import { useState, Suspense } from 'react'
import Sidebar from '@/components/Sidebar'
import { Menu } from 'lucide-react'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false) // Default to collapsed

  return (
    <>
      {/* Noise texture overlay */}
      <div className="noise-overlay fixed top-0 left-0 w-full h-full" />

      {/* Persistent Sidebar - Fixed position */}
      <Suspense fallback={null}>
        <Sidebar 
          isMobileOpen={isMobileOpen} 
          onMobileClose={() => setIsMobileOpen(false)}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </Suspense>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm shadow-sm p-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content with dynamic margin for sidebar */}
      <main className={`min-h-screen pt-16 lg:pt-0 relative z-10 transition-all duration-300 ${isExpanded ? 'lg:ml-56' : 'lg:ml-16'}`}>
        {/* Glassmorphism Background Layer */}
        <div className="absolute inset-0 bg-black/5 backdrop-blur-xl border-l border-white/20 z-0"></div>
        
        {/* Page Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </>
  )
}

