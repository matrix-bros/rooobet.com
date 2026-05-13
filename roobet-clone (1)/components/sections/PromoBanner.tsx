'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 24, seconds: 5 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
          minutes = 59
          seconds = 59
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full bg-surface border border-border rounded-xl p-6 mb-6 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium hover:bg-accent/20 transition-colors">
            Learn More
          </button>
          <div className="flex items-center gap-2 text-accent font-mono text-lg font-bold">
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>

        <div className="flex-1 mx-8">
          <h3 className="text-xl font-bold text-white">The $130,000 Big BTC HODL</h3>
        </div>

        <div className="relative">
          <div className="w-32 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=200&h=120&fit=crop" 
              alt="BTC" 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
          <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-black/80 rounded-full text-xs text-white">
            <Zap className="w-3 h-3 text-accent" />
            <span>160 lucky winners</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
