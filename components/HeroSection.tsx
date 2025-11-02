'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import ContactModal from '@/components/ContactModal'

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  }

  return (
    <section className="flex items-center justify-center min-h-screen px-4 overflow-hidden">
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="text-center max-w-3xl w-full"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="w-full"
        >
          {/* Headline */}
          <motion.h1
            variants={childVariants}
            className="font-extrabold tracking-tight text-white text-5xl md:text-6xl drop-shadow-lg"
          >
            Welcome to My Portfolio
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={childVariants}
            className="mt-6 text-xl leading-8 text-gray-200"
          >
            I'm <span className="text-white font-bold">Rakesh Kumar</span>, passionate about building modern, user-centric, and efficient web applications. Explore my projects to see what I've been working on.
          </motion.p>

          {/* Button Container */}
          <motion.div
            variants={childVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6"
          >
            {/* Primary Button */}
            <Link
              href="/projects"
              className="w-full sm:w-auto text-center rounded-md bg-white px-4 py-3 sm:px-3.5 sm:py-2.5 text-sm font-semibold text-gray-900 shadow-md hover:bg-gray-100 transition-colors active:scale-95"
            >
              View Projects
            </Link>

            {/* Secondary Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto text-center text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors flex items-center justify-center"
            >
              Get in Touch
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

