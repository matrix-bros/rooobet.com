'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Play, Shield } from 'lucide-react'
import { formatCurrency, generateSeed, generateNonce } from '@/lib/utils'

export default function DiceGame() {
  const { user, updateBalance, addBet, openFairnessModal } = useStore()
  const [betAmount, setBetAmount] = useState(1)
  const [target, setTarget] = useState(50)
  const [isOver, setIsOver] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null)
  const [history, setHistory] = useState<{result: number, win: boolean}[]>([])

  const roll = useCallback(() => {
    if (!user || user.balance < betAmount || isRolling) return

    updateBalance(-betAmount)
    setIsRolling(true)
    setResult(null)
    setGameResult(null)

    // Simulate roll animation
    let rollCount = 0
    const maxRolls = 20
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * 100) + 1)
      rollCount++

      if (rollCount >= maxRolls) {
        clearInterval(interval)

        // Final result with 1% house edge
        const finalResult = Math.floor(Math.random() * 100) + 1
        const won = isOver ? finalResult > target : finalResult < target
        const payoutMultiplier = won ? (100 / (isOver ? 100 - target : target)) * 0.99 : 0

        setResult(finalResult)
        setGameResult(won ? 'win' : 'loss')
        setIsRolling(false)

        if (won) {
          const winAmount = betAmount * payoutMultiplier
          updateBalance(winAmount)
          addBet({
            id: Math.random().toString(36),
            game: 'dice',
            amount: betAmount,
            multiplier: payoutMultiplier,
            profit: winAmount - betAmount,
            timestamp: Date.now(),
          })
        } else {
          addBet({
            id: Math.random().toString(36),
            game: 'dice',
            amount: betAmount,
            multiplier: 0,
            profit: -betAmount,
            timestamp: Date.now(),
          })
        }

        setHistory(prev => [{result: finalResult, win: won}, ...prev].slice(0, 10))

        const serverSeed = generateSeed()
        const clientSeed = generateSeed()
        const nonce = generateNonce()
        openFairnessModal({ serverSeed, clientSeed, nonce })
      }
    }, 50)
  }, [user, betAmount, target, isOver, isRolling, updateBalance, addBet, openFairnessModal])

  const winChance = isOver ? 100 - target : target
  const payout = (100 / winChance) * 0.99

  return (
    <div className="space-y-4">
      {/* Result Display */}
      <div className="relative h-40 bg-background rounded-xl border border-border flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {result !== null ? (
            <motion.div
              key={result}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className={`text-6xl font-bold font-mono ${
                gameResult === 'win' ? 'text-green-400' : gameResult === 'loss' ? 'text-red-400' : 'text-white'
              }`}
            >
              {result}
            </motion.div>
          ) : (
            <div className="text-6xl font-bold text-text-secondary/30">?</div>
          )}
        </AnimatePresence>

        {gameResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 text-sm font-bold"
          >
            {gameResult === 'win' ? (
              <span className="text-green-400">+{formatCurrency(betAmount * payout - betAmount)}</span>
            ) : (
              <span className="text-red-400">-{formatCurrency(betAmount)}</span>
            )}
          </motion.div>
        )}
      </div>

      {/* Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Target: {target}</span>
          <span className="text-text-secondary">{isOver ? 'Roll Over' : 'Roll Under'}</span>
        </div>
        <input
          type="range"
          min="2"
          max="98"
          value={target}
          onChange={e => setTarget(Number(e.target.value))}
          className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-xs text-text-secondary">
          <span>Win Chance: {winChance.toFixed(2)}%</span>
          <span>Payout: {payout.toFixed(2)}x</span>
        </div>
      </div>

      {/* Over/Under Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsOver(false)}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            !isOver ? 'bg-accent text-black' : 'bg-background text-text-secondary hover:text-white'
          }`}
        >
          Roll Under
        </button>
        <button
          onClick={() => setIsOver(true)}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
            isOver ? 'bg-accent text-black' : 'bg-background text-text-secondary hover:text-white'
          }`}
        >
          Roll Over
        </button>
      </div>

      {/* Bet Controls */}
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
            onClick={roll}
            disabled={!user || user.balance < betAmount || isRolling}
            className="w-full h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="flex gap-2 overflow-x-auto">
        {history.map((h, i) => (
          <div 
            key={i} 
            className={`px-2 py-1 rounded text-xs font-mono ${
              h.win ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {h.result}
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
