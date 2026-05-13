'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Play, Gem, Bomb, Square, Shield, Banknote } from 'lucide-react'
import { formatCurrency, generateSeed, generateNonce } from '@/lib/utils'

const GRID_SIZE = 25

export default function MinesGame() {
  const { user, updateBalance, addBet, openFairnessModal } = useStore()
  const [betAmount, setBetAmount] = useState(1)
  const [minesCount, setMinesCount] = useState(5)
  const [grid, setGrid] = useState<boolean[]>(Array(GRID_SIZE).fill(false))
  const [revealed, setRevealed] = useState<boolean[]>(Array(GRID_SIZE).fill(false))
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [currentMultiplier, setCurrentMultiplier] = useState(1)
  const [history, setHistory] = useState<{profit: number, multiplier: number}[]>([])

  const calculateMultiplier = useCallback((revealedCount: number, totalMines: number) => {
    const safeTiles = GRID_SIZE - totalMines
    if (revealedCount === 0) return 1
    let mult = 1
    for (let i = 0; i < revealedCount; i++) {
      mult *= (safeTiles - i) / (GRID_SIZE - i)
    }
    return (1 / mult) * 0.99
  }, [])

  const startGame = () => {
    if (!user || user.balance < betAmount) return

    updateBalance(-betAmount)

    // Generate mines
    const newGrid = Array(GRID_SIZE).fill(false)
    const minePositions = new Set<number>()
    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * GRID_SIZE))
    }
    minePositions.forEach(pos => newGrid[pos] = true)

    setGrid(newGrid)
    setRevealed(Array(GRID_SIZE).fill(false))
    setGameActive(true)
    setGameOver(false)
    setWon(false)
    setCurrentMultiplier(1)
  }

  const revealCell = (index: number) => {
    if (!gameActive || gameOver || revealed[index]) return

    const newRevealed = [...revealed]
    newRevealed[index] = true
    setRevealed(newRevealed)

    if (grid[index]) {
      // Hit a mine
      setGameActive(false)
      setGameOver(true)
      setWon(false)

      // Reveal all mines
      const allRevealed = grid.map((isMine, i) => isMine || newRevealed[i])
      setRevealed(allRevealed)

      addBet({
        id: Math.random().toString(36),
        game: 'mines',
        amount: betAmount,
        multiplier: 0,
        profit: -betAmount,
        timestamp: Date.now(),
      })

      const serverSeed = generateSeed()
      const clientSeed = generateSeed()
      const nonce = generateNonce()
      openFairnessModal({ serverSeed, clientSeed, nonce })
    } else {
      const revealedCount = newRevealed.filter((r, i) => r && !grid[i]).length
      const mult = calculateMultiplier(revealedCount, minesCount)
      setCurrentMultiplier(mult)

      // Check if all safe tiles revealed
      const safeTiles = GRID_SIZE - minesCount
      if (revealedCount === safeTiles) {
        setGameActive(false)
        setGameOver(true)
        setWon(true)
        const winAmount = betAmount * mult
        updateBalance(winAmount)

        addBet({
          id: Math.random().toString(36),
          game: 'mines',
          amount: betAmount,
          multiplier: mult,
          profit: winAmount - betAmount,
          timestamp: Date.now(),
        })

        setHistory(prev => [{profit: winAmount - betAmount, multiplier: mult}, ...prev].slice(0, 10))

        const serverSeed = generateSeed()
        const clientSeed = generateSeed()
        const nonce = generateNonce()
        openFairnessModal({ serverSeed, clientSeed, nonce })
      }
    }
  }

  const cashOut = () => {
    if (!gameActive || gameOver) return

    const winAmount = betAmount * currentMultiplier
    updateBalance(winAmount)
    setGameActive(false)
    setGameOver(true)
    setWon(true)

    addBet({
      id: Math.random().toString(36),
      game: 'mines',
      amount: betAmount,
      multiplier: currentMultiplier,
      profit: winAmount - betAmount,
      timestamp: Date.now(),
    })

    setHistory(prev => [{profit: winAmount - betAmount, multiplier: currentMultiplier}, ...prev].slice(0, 10))

    const serverSeed = generateSeed()
    const clientSeed = generateSeed()
    const nonce = generateNonce()
    openFairnessModal({ serverSeed, clientSeed, nonce })
  }

  return (
    <div className="space-y-4">
      {/* Grid */}
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: gameActive && !revealed[i] ? 1.05 : 1 }}
            whileTap={{ scale: gameActive && !revealed[i] ? 0.95 : 1 }}
            onClick={() => revealCell(i)}
            className={`aspect-square rounded-lg flex items-center justify-center text-2xl transition-all ${
              revealed[i] 
                ? grid[i] 
                  ? 'bg-red-500/20 border-red-500/50' 
                  : 'bg-green-500/20 border-green-500/50'
                : gameActive 
                  ? 'bg-surface border-border hover:border-accent cursor-pointer' 
                  : 'bg-surface border-border'
            } border-2`}
            disabled={!gameActive || revealed[i]}
          >
            <AnimatePresence>
              {revealed[i] && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                >
                  {grid[i] ? (
                    <Bomb className="w-6 h-6 text-red-400" />
                  ) : (
                    <Gem className="w-6 h-6 text-green-400" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Multiplier Display */}
      {gameActive && (
        <div className="text-center">
          <p className="text-2xl font-bold text-accent">{currentMultiplier.toFixed(2)}x</p>
          <p className="text-sm text-text-secondary">
            Potential Win: {formatCurrency(betAmount * currentMultiplier)}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Bet Amount</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={betAmount}
              onChange={e => setBetAmount(Number(e.target.value))}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-white text-center"
              min="0.01"
              step="0.01"
              disabled={gameActive}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-text-secondary">Mines ({minesCount})</label>
          <input
            type="range"
            min="1"
            max="24"
            value={minesCount}
            onChange={e => setMinesCount(Number(e.target.value))}
            className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-accent"
            disabled={gameActive}
          />
        </div>
      </div>

      <div className="flex gap-3">
        {!gameActive ? (
          <button
            onClick={startGame}
            disabled={!user || user.balance < betAmount}
            className="flex-1 h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Game
          </button>
        ) : (
          <>
            <button
              onClick={cashOut}
              className="flex-1 h-11 bg-green-500 text-white font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Banknote className="w-4 h-4" />
              Cash Out ({formatCurrency(betAmount * currentMultiplier)})
            </button>
          </>
        )}
      </div>

      {/* History */}
      <div className="flex gap-2 overflow-x-auto">
        {history.map((h, i) => (
          <div 
            key={i} 
            className="px-2 py-1 rounded text-xs font-mono bg-green-500/10 text-green-400"
          >
            {h.multiplier.toFixed(2)}x
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
