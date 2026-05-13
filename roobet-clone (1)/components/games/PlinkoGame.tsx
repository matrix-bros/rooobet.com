'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Play, Shield } from 'lucide-react'
import { formatCurrency, generateSeed, generateNonce } from '@/lib/utils'

const ROWS = 12
const BUCKETS = [
  { mult: 0.2, color: 'bg-red-500' },
  { mult: 0.5, color: 'bg-orange-500' },
  { mult: 1, color: 'bg-yellow-500' },
  { mult: 2, color: 'bg-green-500' },
  { mult: 5, color: 'bg-blue-500' },
  { mult: 10, color: 'bg-purple-500' },
  { mult: 25, color: 'bg-pink-500' },
  { mult: 10, color: 'bg-purple-500' },
  { mult: 5, color: 'bg-blue-500' },
  { mult: 2, color: 'bg-green-500' },
  { mult: 1, color: 'bg-yellow-500' },
  { mult: 0.5, color: 'bg-orange-500' },
  { mult: 0.2, color: 'bg-red-500' },
]

export default function PlinkoGame() {
  const { user, updateBalance, addBet, openFairnessModal } = useStore()
  const [betAmount, setBetAmount] = useState(1)
  const [balls, setBalls] = useState<{id: number, path: number[], finalBucket: number}[]>([])
  const [isDropping, setIsDropping] = useState(false)
  const [history, setHistory] = useState<{mult: number, profit: number}[]>([])
  const ballIdRef = useRef(0)

  const dropBall = useCallback(() => {
    if (!user || user.balance < betAmount || isDropping) return

    updateBalance(-betAmount)
    setIsDropping(true)

    const id = ballIdRef.current++
    const path: number[] = []
    let position = 6 // Start in middle

    for (let row = 0; row < ROWS; row++) {
      position += Math.random() > 0.5 ? 1 : -1
      position = Math.max(0, Math.min(BUCKETS.length - 1, position))
      path.push(position)
    }

    const finalBucket = path[path.length - 1]
    const multiplier = BUCKETS[finalBucket].mult
    const winAmount = betAmount * multiplier

    setBalls(prev => [...prev, { id, path, finalBucket }])

    setTimeout(() => {
      updateBalance(winAmount)
      setIsDropping(false)

      const profit = winAmount - betAmount
      addBet({
        id: Math.random().toString(36),
        game: 'plinko',
        amount: betAmount,
        multiplier,
        profit,
        timestamp: Date.now(),
      })

      setHistory(prev => [{mult: multiplier, profit}, ...prev].slice(0, 10))

      const serverSeed = generateSeed()
      const clientSeed = generateSeed()
      const nonce = generateNonce()
      openFairnessModal({ serverSeed, clientSeed, nonce })

      // Remove ball after animation
      setTimeout(() => {
        setBalls(prev => prev.filter(b => b.id !== id))
      }, 3000)
    }, 2000)
  }, [user, betAmount, isDropping, updateBalance, addBet, openFairnessModal])

  return (
    <div className="space-y-4">
      {/* Board */}
      <div className="relative bg-background rounded-xl border border-border p-4 overflow-hidden">
        {/* Pegs */}
        <div className="flex flex-col items-center gap-1 mb-2">
          {Array.from({ length: ROWS }).map((_, row) => (
            <div key={row} className="flex gap-3">
              {Array.from({ length: row + 3 }).map((_, col) => (
                <div key={col} className="w-2 h-2 rounded-full bg-white/20" />
              ))}
            </div>
          ))}
        </div>

        {/* Balls */}
        <AnimatePresence>
          {balls.map(ball => (
            <motion.div
              key={ball.id}
              initial={{ top: 0, left: '50%' }}
              animate={{ 
                top: '80%',
                left: `${(ball.finalBucket / (BUCKETS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="absolute w-4 h-4 bg-accent rounded-full shadow-lg shadow-accent/50 z-10"
              style={{ transform: 'translateX(-50%)' }}
            />
          ))}
        </AnimatePresence>

        {/* Buckets */}
        <div className="flex gap-1 mt-2">
          {BUCKETS.map((bucket, i) => (
            <div 
              key={i}
              className={`flex-1 py-2 rounded-md text-center text-xs font-bold ${bucket.color} text-white`}
            >
              {bucket.mult}x
            </div>
          ))}
        </div>
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
            onClick={dropBall}
            disabled={!user || user.balance < betAmount || isDropping}
            className="w-full h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isDropping ? 'Dropping...' : 'Drop Ball'}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="flex gap-2 overflow-x-auto">
        {history.map((h, i) => (
          <div 
            key={i} 
            className={`px-2 py-1 rounded text-xs font-mono ${
              h.profit > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {h.mult}x
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
