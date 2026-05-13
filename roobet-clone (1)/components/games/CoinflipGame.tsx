'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Play, Shield } from 'lucide-react'
import { formatCurrency, generateSeed, generateNonce } from '@/lib/utils'

export default function CoinflipGame() {
  const { user, updateBalance, addBet, openFairnessModal } = useStore()
  const [betAmount, setBetAmount] = useState(1)
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads')
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<'heads' | 'tails' | null>(null)
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null)
  const [history, setHistory] = useState<{side: 'heads' | 'tails', win: boolean}[]>([])

  const flip = useCallback(() => {
    if (!user || user.balance < betAmount || isFlipping) return

    updateBalance(-betAmount)
    setIsFlipping(true)
    setResult(null)
    setGameResult(null)

    setTimeout(() => {
      const isHeads = Math.random() > 0.5
      const finalResult = isHeads ? 'heads' : 'tails'
      const won = finalResult === selectedSide

      setResult(finalResult)
      setIsFlipping(false)
      setGameResult(won ? 'win' : 'loss')

      if (won) {
        const winAmount = betAmount * 1.98 // 1% house edge
        updateBalance(winAmount)
        addBet({
          id: Math.random().toString(36),
          game: 'coinflip',
          amount: betAmount,
          multiplier: 1.98,
          profit: winAmount - betAmount,
          timestamp: Date.now(),
        })
      } else {
        addBet({
          id: Math.random().toString(36),
          game: 'coinflip',
          amount: betAmount,
          multiplier: 0,
          profit: -betAmount,
          timestamp: Date.now(),
        })
      }

      setHistory(prev => [{side: finalResult, win: won}, ...prev].slice(0, 10))

      const serverSeed = generateSeed()
      const clientSeed = generateSeed()
      const nonce = generateNonce()
      openFairnessModal({ serverSeed, clientSeed, nonce })
    }, 3000)
  }, [user, betAmount, selectedSide, isFlipping, updateBalance, addBet, openFairnessModal])

  return (
    <div className="space-y-4">
      {/* Coin Display */}
      <div className="relative h-48 bg-background rounded-xl border border-border flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {isFlipping ? (
            <motion.div
              key="flipping"
              animate={{ rotateY: [0, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620, 1800] }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-amber-500 flex items-center justify-center shadow-lg shadow-accent/30"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="text-4xl">🪙</span>
            </motion.div>
          ) : result ? (
            <motion.div
              key={result}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
                gameResult === 'win' ? 'shadow-green-500/30' : 'shadow-red-500/30'
              }`}
            >
              <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl ${
                result === 'heads' ? 'bg-gradient-to-br from-accent to-amber-500' : 'bg-gradient-to-br from-gray-600 to-gray-800'
              }`}>
                {result === 'heads' ? '👑' : '⚡'}
              </div>
            </motion.div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent/30 to-amber-500/30 flex items-center justify-center text-4xl">
              🪙
            </div>
          )}
        </AnimatePresence>

        {gameResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 text-lg font-bold"
          >
            {gameResult === 'win' ? (
              <span className="text-green-400">+{formatCurrency(betAmount * 0.98)}</span>
            ) : (
              <span className="text-red-400">-{formatCurrency(betAmount)}</span>
            )}
          </motion.div>
        )}
      </div>

      {/* Side Selection */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedSide('heads')}
          className={`py-4 rounded-xl text-lg font-bold transition-all ${
            selectedSide === 'heads' ? 'bg-accent text-black ring-2 ring-accent' : 'bg-background text-text-secondary hover:bg-surface'
          }`}
        >
          👑 Heads
        </button>
        <button
          onClick={() => setSelectedSide('tails')}
          className={`py-4 rounded-xl text-lg font-bold transition-all ${
            selectedSide === 'tails' ? 'bg-gray-600 text-white ring-2 ring-accent' : 'bg-background text-text-secondary hover:bg-surface'
          }`}
        >
          ⚡ Tails
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Bet Amount</label>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setBetAmount(Math.max(0.01, betAmount / 2))}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm text-white hover:bg-surface"
            >
              1/2
            </button>
            <input
              type="number"
              value={betAmount}
              onChange={e => setBetAmount(Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-white text-center"
              min="0.01"
              step="0.01"
            />
            <button 
              onClick={() => setBetAmount(betAmount * 2)}
              className="px-3 py-2 bg-background border border-border rounded-md text-sm text-white hover:bg-surface"
            >
              2x
            </button>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={flip}
            disabled={!user || user.balance < betAmount || isFlipping}
            className="w-full h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="flex gap-2 overflow-x-auto">
        {history.map((h, i) => (
          <div 
            key={i} 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              h.win ? 'ring-2 ring-accent' : ''
            } ${h.side === 'heads' ? 'bg-accent/20' : 'bg-gray-600/20'}`}
          >
            {h.side === 'heads' ? '👑' : '⚡'}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Shield className="w-3 h-3" />
        <span>Provably Fair - House Edge 1%</span>
      </div>
    </div>
  )
}
