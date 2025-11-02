'use client'

import Image from 'next/image'

interface ProductCardProps {
  title: string
  description: string
  imageUrl: string
  priceDisplay: string // e.g., "₹999"
  onPurchase: () => void // The click handler
}

export default function ProductCard({
  title,
  description,
  imageUrl,
  priceDisplay,
  onPurchase,
}: ProductCardProps) {
  return (
    <div className="bg-black/30 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden hover:bg-black/40 transition-all duration-300 flex flex-col">
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

        {/* Price and Purchase Button */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          {/* Price */}
          <span className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
            {priceDisplay}
          </span>

          {/* Purchase Now button */}
          <button
            onClick={onPurchase}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-xs md:text-sm transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            Purchase Now
          </button>
        </div>
      </div>
    </div>
  )
}
