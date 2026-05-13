'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'

export default function FeatureCards() {
  const { openGameModal } = useStore()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Casino Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => openGameModal('roulette')}
        className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-casino-purple to-casino-purple-dark" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596832817342-5432eb3200a6?w=600&h=300&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity" />

        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex gap-4">
            <span className="text-4xl animate-float">🎰</span>
            <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🎲</span>
            <span className="text-4xl animate-float" style={{ animationDelay: '1s' }}>🃏</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Casino</h3>
            <p className="text-sm text-slate-300">Thousands of Games</p>
          </div>
        </div>
      </motion.div>

      {/* Sports Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sports-amber to-sports-amber-dark" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&h=300&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:opacity-40 transition-opacity" />

        <div className="relative z-10 p-6 h-full flex flex-col justify-end">
          <h3 className="text-2xl font-bold text-white mb-1">Sports Betting</h3>
          <p className="text-sm text-white/80">Support Your Team</p>
        </div>
      </motion.div>
    </div>
  )
}
