'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X } from 'lucide-react'
import CrashGame from './CrashGame'
import DiceGame from './DiceGame'
import MinesGame from './MinesGame'
import PlinkoGame from './PlinkoGame'
import RouletteGame from './RouletteGame'
import CoinflipGame from './CoinflipGame'

const gameComponents: Record<string, React.ComponentType> = {
  crash: CrashGame,
  dice: DiceGame,
  mines: MinesGame,
  plinko: PlinkoGame,
  roulette: RouletteGame,
  coinflip: CoinflipGame,
}

export default function GameModal() {
  const { gameModalOpen, closeGameModal, activeGame } = useStore()

  if (!gameModalOpen || !activeGame) return null

  const GameComponent = gameComponents[activeGame]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={closeGameModal}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-4xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold text-white capitalize">{activeGame}</h2>
            <button onClick={closeGameModal} className="p-1 text-text-secondary hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Game Content */}
          <div className="p-6">
            {GameComponent && <GameComponent />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
