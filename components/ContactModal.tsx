'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X as CloseIcon, Twitter, Github, Linkedin, Instagram, Facebook, Mail, Check } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [emailCopied, setEmailCopied] = useState(false)

  const email = 'me@rakeshcodes.in'

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                type: 'spring',
                duration: 0.4,
                bounce: 0.2
              }}
              className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-xl p-8 w-full max-w-md pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                aria-label="Close modal"
              >
                <CloseIcon className="w-5 h-5" />
              </button>

              {/* Title */}
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">
                Get in Touch
              </h2>

              {/* Subtitle */}
              <p className="text-gray-200 mt-2 mb-6 drop-shadow-sm">
                Let's connect and build something amazing.
              </p>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                <a
                  href="https://github.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 text-gray-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-full h-full" />
                </a>
                <a
                  href="https://linkedin.com/in/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 text-gray-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-full h-full" />
                </a>
                <a
                  href="https://x.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 text-gray-300 hover:text-white transition-colors"
                  aria-label="X (formerly Twitter)"
                >
                  <Twitter className="w-full h-full" />
                </a>
                <a
                  href="https://instagram.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 text-gray-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-full h-full" />
                </a>
                <a
                  href="https://facebook.com/your-username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 text-gray-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-full h-full" />
                </a>
              </div>

              {/* Email Section */}
              <div className="mt-8 p-4 bg-black/30 rounded-lg border border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-white font-mono text-sm truncate">
                      {email}
                    </span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 flex-shrink-0"
                  >
                    {emailCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

