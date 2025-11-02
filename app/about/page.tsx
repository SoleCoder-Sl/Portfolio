'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Bot, Code } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  const [avatarSettings, setAvatarSettings] = useState({
    objectPosition: 'center 52%',
    scale: 85
  })

  useEffect(() => {
    // Load saved settings from localStorage
    const saved = localStorage.getItem('avatarSettings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        setAvatarSettings(settings)
      } catch (e) {
        console.error('Error loading avatar settings:', e)
      }
    }
  }, [])

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-8 md:py-12 px-4">
      <div className="w-full max-w-5xl">
        {/* Main Content Container */}
        <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 p-6 md:p-8 lg:p-12 shadow-lg">
          {/* Hero Section - Avatar & Intro */}
          <div className="text-center">
            {/* Avatar */}
            <div className="mx-auto mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto overflow-hidden shadow-lg shadow-white/20 border-4 border-white/20 relative">
                <Image
                  src="/img/Gemini_Generated_Image_emj8avemj8avemj8.png"
                  alt="Profile Picture"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover object-center"
                  priority
                  style={{ 
                    objectPosition: avatarSettings.objectPosition,
                    transform: `scale(${avatarSettings.scale / 100})`
                  }}
                />
              </div>
            </div>

            {/* Greeting & Name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-4 md:mt-6 drop-shadow-md">
              Hi, I'm Rakesh!
            </h1>

            {/* Tagline */}
            <p className="text-base md:text-lg lg:text-xl text-gray-200 mt-2 drop-shadow-md px-4">
              A passionate developer building the future, one line of code at a time.
            </p>
          </div>

          {/* Bio Section */}
          <div className="mt-8 md:mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-md">
              My Mission
            </h2>
            
            <div className="space-y-4">
              <p className="text-base md:text-lg text-gray-200 leading-relaxed drop-shadow-sm">
                I'm a developer who believes in 'vibe coding'—using AI as a creative partner to build beautiful, intelligent applications. For me, code is a conversation between an idea and its execution. My passion lies in translating high-level vision into functional, elegant digital experiences.
              </p>

              <p className="text-base md:text-lg text-gray-200 leading-relaxed drop-shadow-sm">
                This philosophy extends beyond my own projects. I am the founder of <strong className="text-white font-semibold">Beyond Marks Academy</strong>, an initiative dedicated to reshaping tech education. We move 'beyond marks' to focus on real-world skills, personalized AI-driven learning paths, and building a generation of developers who are not just proficient, but future-ready.
              </p>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="mt-8 md:mt-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-md">
              My Toolkit
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Column 1: AI & n8n Workflows */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Bot className="w-8 h-8 text-pink-400" />
                  <h3 className="text-2xl font-semibold text-white drop-shadow-md">
                    AI & Workflow Automation
                  </h3>
                </div>
                <p className="text-gray-200 mt-2 leading-relaxed drop-shadow-sm">
                  I don't just use tools; I orchestrate systems. I specialize in building complex, end-to-end automations with <strong className="text-white font-semibold">n8n</strong>, connecting hundreds of apps and AI models. I build the digital 'glue' that allows businesses to automate, scale, and function intelligently.
                </p>
              </div>

              {/* Column 2: Modern Web Stack */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Code className="w-8 h-8 text-sky-400" />
                  <h3 className="text-2xl font-semibold text-white drop-shadow-md">
                    Full-Stack Vibe
                  </h3>
                </div>
                <p className="text-gray-200 mt-2 leading-relaxed drop-shadow-sm">
                  My stack is built for speed, aesthetics, and intelligence. I leverage <strong className="text-white font-semibold">Next.js</strong>, <strong className="text-white font-semibold">React</strong>, <strong className="text-white font-semibold">Tailwind CSS</strong>, and modern AI/LLM integrations to build products that feel alive and intuitive.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-200 mb-6 drop-shadow-sm">
              Interested in working together or learning more about my work?
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20"
            >
              Explore My Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

