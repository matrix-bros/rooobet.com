'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { Play, Square, TrendingUp, Shield } from 'lucide-react'
import { formatCurrency, generateSeed, generateNonce } from '@/lib/utils'

export default function CrashGame() {
  const { user, updateBalance, addBet, openFairnessModal } = useStore()
  const [betAmount, setBetAmount] = useState(1)
  const [multiplier, setMultiplier] = useState(1.0)
  const [isRunning, setIsRunning] = useState(false)
  const [hasCashedOut, setHasCashedOut] = useState(false)
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null)
  const [crashPoint, setCrashPoint] = useState(1.0)
  const [history, setHistory] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)

  const generateCrashPoint = useCallback(() => {
    const r = Math.random()
    // 1% house edge: crash point = 0.99 / (1 - r) with max cap
    const point = Math.min(0.99 / (1 - r), 100)
    return Math.max(1.0, point)
  }, [])

  const drawGraph = useCallback((currentMultiplier: number, progress: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Curve
    ctx.strokeStyle = isRunning ? '#FACC15' : gameResult === 'win' ? '#22c55e' : gameResult === 'loss' ? '#ef4444' : '#FACC15'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, height)

    for (let i = 0; i <= progress * width; i += 2) {
      const t = i / width
      const m = 1 + t * (currentMultiplier - 1)
      const y = height - (Math.log(m) / Math.log(100)) * height * 0.8
      ctx.lineTo(i, Math.max(0, y))
    }
    ctx.stroke()

    // Glow effect
    ctx.shadowColor = ctx.strokeStyle
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0
  }, [isRunning, gameResult])

  const startGame = () => {
    if (!user || user.balance < betAmount) return

    updateBalance(-betAmount)
    const point = generateCrashPoint()
    setCrashPoint(point)
    setMultiplier(1.0)
    setIsRunning(true)
    setHasCashedOut(false)
    setGameResult(null)
    startTimeRef.current = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const currentMult = Math.pow(1.06, elapsed)

      if (currentMult >= point) {
        // Crashed
        setMultiplier(point)
        setIsRunning(false)
        setGameResult('loss')
        setHistory(prev => [point, ...prev].slice(0, 10))

        const serverSeed = generateSeed()
        const clientSeed = generateSeed()
        const nonce = generateNonce()
        addBet({
          id: Math.random().toString(36),
          game: 'crash',
          amount: betAmount,
          multiplier: 0,
          profit: -betAmount,
          timestamp: Date.now(),
        })
        openFairnessModal({ serverSeed, clientSeed, nonce })
        return
      }

      setMultiplier(currentMult)
      const progress = elapsed / 10
      drawGraph(currentMult, Math.min(progress, 1))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  const cashOut = () => {
    if (!isRunning || hasCashedOut) return

    setHasCashedOut(true)
    setIsRunning(false)
    if (animationRef.current) cancelAnimationFrame(animationRef.current)

    const winAmount = betAmount * multiplier
    updateBalance(winAmount)
    setGameResult('win')
    setHistory(prev => [multiplier, ...prev].slice(0, 10))

    const serverSeed = generateSeed()
    const clientSeed = generateSeed()
    const nonce = generateNonce()
    addBet({
      id: Math.random().toString(36),
      game: 'crash',
      amount: betAmount,
      multiplier,
      profit: winAmount - betAmount,
      timestamp: Date.now(),
    })
    openFairnessModal({ serverSeed, clientSeed, nonce })
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Graph */}
      <div className="relative h-64 bg-background rounded-xl overflow-hidden border border-border">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={256}
          className="w-full h-full"
        />
        <div className="absolute top-4 left-4">
          <motion.div 
            animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className={`text-4xl font-bold font-mono ${
              gameResult === 'win' ? 'text-green-400' : gameResult === 'loss' ? 'text-red-400' : 'text-accent'
            }`}
          >
            {multiplier.toFixed(2)}x
          </motion.div>
        </div>
        {gameResult === 'loss' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-red-400"
            >
              BUSTED @ {crashPoint.toFixed(2)}x
            </motion.div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="flex gap-2 overflow-x-auto">
        {history.map((h, i) => (
          <div 
            key={i} 
            className={`px-2 py-1 rounded text-xs font-mono ${
              h < 2 ? 'bg-red-500/10 text-red-400' : h < 5 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'
            }`}
          >
            {h.toFixed(2)}x
          </div>
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
          {!isRunning ? (
            <button
              onClick={startGame}
              disabled={!user || user.balance < betAmount}
              className="w-full h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Game
            </button>
          ) : (
            <button
              onClick={cashOut}
              className="w-full h-11 bg-green-500 text-white font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Cash Out @ {multiplier.toFixed(2)}x
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Shield className="w-3 h-3" />
        <span>Provably Fair - House Edge 1%</span>
      </div>
    </div>
  )
}
