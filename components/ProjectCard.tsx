import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  imageUrl: string
  liveUrl?: string
  githubUrl?: string
}

export default function ProjectCard({
  title,
  description,
  tags,
  imageUrl,
  liveUrl,
  githubUrl,
}: ProjectCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden hover:bg-black/50 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 md:h-56 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 drop-shadow-md line-clamp-2">{title}</h3>

        {/* Description */}
        <p className="text-gray-200 text-xs md:text-sm mb-4 line-clamp-3 drop-shadow-md flex-1">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        {(liveUrl || githubUrl) && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            {liveUrl && (
              <Link
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-medium rounded-lg transition-colors active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </Link>
            )}
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs md:text-sm font-medium rounded-lg transition-colors active:scale-95"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

