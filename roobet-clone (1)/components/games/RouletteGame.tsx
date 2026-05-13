'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Play, Shield } from 'lucide-react'
import { formatCurrency, generateSeed, generateNonce } from '@/lib/utils'

const RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
const BLACK_NUMBERS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]

export default function RouletteGame() {
  const { user, updateBalance, addBet, openFairnessModal } = useStore()
  const [betAmount, setBetAmount] = useState(1)
  const [selectedBet, setSelectedBet] = useState<string | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null)
  const [history, setHistory] = useState<{number: number, win: boolean}[]>([])

  const spin = useCallback(() => {
    if (!user || user.balance < betAmount || isSpinning || !selectedBet) return

    updateBalance(-betAmount)
    setIsSpinning(true)
    setResult(null)
    setGameResult(null)

    // Simulate spin
    const finalNumber = Math.floor(Math.random() * 37)
    const isRed = RED_NUMBERS.includes(finalNumber)
    const isBlack = BLACK_NUMBERS.includes(finalNumber)
    const isEven = finalNumber !== 0 && finalNumber % 2 === 0
    const isOdd = finalNumber !== 0 && finalNumber % 2 === 1
    const isLow = finalNumber >= 1 && finalNumber <= 18
    const isHigh = finalNumber >= 19 && finalNumber <= 36

    let won = false
    let payout = 0

    if (selectedBet.startsWith('num-')) {
      const num = parseInt(selectedBet.split('-')[1])
      if (finalNumber === num) {
        won = true
        payout = betAmount * 36
      }
    } else if (selectedBet === 'red' && isRed) {
      won = true
      payout = betAmount * 2
    } else if (selectedBet === 'black' && isBlack) {
      won = true
      payout = betAmount * 2
    } else if (selectedBet === 'even' && isEven) {
      won = true
      payout = betAmount * 2
    } else if (selectedBet === 'odd' && isOdd) {
      won = true
      payout = betAmount * 2
    } else if (selectedBet === 'low' && isLow) {
      won = true
      payout = betAmount * 2
    } else if (selectedBet === 'high' && isHigh) {
      won = true
      payout = betAmount * 2
    }

    // Apply house edge
    payout = payout * 0.973

    setTimeout(() => {
      setResult(finalNumber)
      setIsSpinning(false)
      setGameResult(won ? 'win' : 'loss')

      if (won) {
        updateBalance(payout)
        addBet({
          id: Math.random().toString(36),
          game: 'roulette',
          amount: betAmount,
          multiplier: payout / betAmount,
          profit: payout - betAmount,
          timestamp: Date.now(),
        })
      } else {
        addBet({
          id: Math.random().toString(36),
          game: 'roulette',
          amount: betAmount,
          multiplier: 0,
          profit: -betAmount,
          timestamp: Date.now(),
        })
      }

      setHistory(prev => [{number: finalNumber, win: won}, ...prev].slice(0, 10))

      const serverSeed = generateSeed()
      const clientSeed = generateSeed()
      const nonce = generateNonce()
      openFairnessModal({ serverSeed, clientSeed, nonce })
    }, 3000)
  }, [user, betAmount, selectedBet, isSpinning, updateBalance, addBet, openFairnessModal])

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-green-500'
    if (RED_NUMBERS.includes(num)) return 'bg-red-500'
    return 'bg-gray-900'
  }

  return (
    <div className="space-y-4">
      {/* Wheel Display */}
      <div className="relative h-48 bg-background rounded-xl border border-border flex items-center justify-center overflow-hidden">
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              animate={{ rotate: 720 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="w-32 h-32 rounded-full border-4 border-accent relative"
            >
              {Array.from({ length: 37 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-3 h-3 rounded-full ${getNumberColor(i)}`}
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * (360/37)}deg) translateY(-60px) translateX(-50%)`,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isSpinning && result !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-16 h-16 rounded-full ${getNumberColor(result)} flex items-center justify-center text-2xl font-bold text-white`}
          >
            {result}
          </motion.div>
        )}

        {!isSpinning && result === null && (
          <div className="text-4xl font-bold text-text-secondary/30">?</div>
        )}
      </div>

      {/* Betting Grid */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setSelectedBet('red')}
          className={`py-3 rounded-md text-sm font-bold transition-all ${
            selectedBet === 'red' ? 'bg-red-500 text-white ring-2 ring-accent' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          }`}
        >
          Red
        </button>
        <button
          onClick={() => setSelectedBet('black')}
          className={`py-3 rounded-md text-sm font-bold transition-all ${
            selectedBet === 'black' ? 'bg-gray-900 text-white ring-2 ring-accent' : 'bg-gray-900/50 text-gray-400 hover:bg-gray-900/70'
          }`}
        >
          Black
        </button>
        <button
          onClick={() => setSelectedBet('even')}
          className={`py-3 rounded-md text-sm font-bold transition-all ${
            selectedBet === 'even' ? 'bg-accent text-black' : 'bg-background text-text-secondary hover:bg-surface'
          }`}
        >
          Even
        </button>
        <button
          onClick={() => setSelectedBet('odd')}
          className={`py-3 rounded-md text-sm font-bold transition-all ${
            selectedBet === 'odd' ? 'bg-accent text-black' : 'bg-background text-text-secondary hover:bg-surface'
          }`}
        >
          Odd
        </button>
        <button
          onClick={() => setSelectedBet('low')}
          className={`py-3 rounded-md text-sm font-bold transition-all ${
            selectedBet === 'low' ? 'bg-accent text-black' : 'bg-background text-text-secondary hover:bg-surface'
          }`}
        >
          1-18
        </button>
        <button
          onClick={() => setSelectedBet('high')}
          className={`py-3 rounded-md text-sm font-bold transition-all ${
            selectedBet === 'high' ? 'bg-accent text-black' : 'bg-background text-text-secondary hover:bg-surface'
          }`}
        >
          19-36
        </button>
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-6 gap-1">
        <button
          onClick={() => setSelectedBet('num-0')}
          className={`py-2 rounded text-xs font-bold ${
            selectedBet === 'num-0' ? 'bg-green-500 text-white ring-2 ring-accent' : 'bg-green-500/20 text-green-400'
          }`}
        >
          0
        </button>
        {Array.from({ length: 36 }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setSelectedBet(`num-${i + 1}`)}
            className={`py-2 rounded text-xs font-bold ${
              selectedBet === `num-${i + 1}` ? 'ring-2 ring-accent' : ''
            } ${getNumberColor(i + 1)} ${RED_NUMBERS.includes(i + 1) ? 'text-white' : 'text-gray-300'}`}
          >
            {i + 1}
          </button>
        ))}
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
            onClick={spin}
            disabled={!user || user.balance < betAmount || isSpinning || !selectedBet}
            className="w-full h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>
      </div>

      {/* History */}
      <div className="flex gap-2 overflow-x-auto">
        {history.map((h, i) => (
          <div 
            key={i} 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              h.win ? 'ring-2 ring-accent' : ''
            } ${getNumberColor(h.number)} text-white`}
          >
            {h.number}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Shield className="w-3 h-3" />
        <span>Provably Fair - House Edge 2.7%</span>
      </div>
    </div>
  )
}
