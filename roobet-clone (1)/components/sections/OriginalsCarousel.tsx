'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GAMES } from '@/lib/constants'
import { useStore } from '@/lib/store'

export default function OriginalsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { openGameModal } = useStore()

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Roobet Originals</h2>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">
            View All
          </a>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 bg-surface border border-border rounded-md text-text-secondary hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 bg-surface border border-border rounded-md text-text-secondary hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
      >
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openGameModal(game.id as any)}
            className="flex-shrink-0 w-[180px] cursor-pointer group"
          >
            <div className="relative h-[240px] rounded-xl overflow-hidden bg-surface border border-border hover:border-accent/50 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
              <img 
                src={game.image} 
                alt={game.name}
                className="w-full h-[180px] object-cover"
              />

              {game.rtp && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-md text-xs text-accent font-medium">
                  RTP {game.rtp}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-sm font-bold text-white">{game.name}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
