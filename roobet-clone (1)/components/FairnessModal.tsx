'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X, Copy, Check, Shield } from 'lucide-react'
import { useState } from 'react'

export default function FairnessModal() {
  const { fairnessModalOpen, closeFairnessModal, currentProvablyFair } = useStore()
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!fairnessModalOpen || !currentProvablyFair) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeFairnessModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-surface border border-border rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-white">Provably Fair</h2>
            </div>
            <button onClick={closeFairnessModal} className="p-1 text-text-secondary hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-background rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Server Seed (Hashed)</span>
                <button 
                  onClick={() => copy(currentProvablyFair.serverSeed, 'server')}
                  className="p-1 text-text-secondary hover:text-white"
                >
                  {copied === 'server' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs font-mono text-white break-all">{currentProvablyFair.serverSeed}</p>
            </div>

            <div className="p-3 bg-background rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Client Seed</span>
                <button 
                  onClick={() => copy(currentProvablyFair.clientSeed, 'client')}
                  className="p-1 text-text-secondary hover:text-white"
                >
                  {copied === 'client' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs font-mono text-white break-all">{currentProvablyFair.clientSeed}</p>
            </div>

            <div className="p-3 bg-background rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Nonce</span>
                <button 
                  onClick={() => copy(currentProvablyFair.nonce.toString(), 'nonce')}
                  className="p-1 text-text-secondary hover:text-white"
                >
                  {copied === 'nonce' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs font-mono text-white">{currentProvablyFair.nonce}</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <p className="text-xs text-accent">
              You can verify this bet using the server seed, client seed, and nonce. 
              The server seed will be revealed after the next round.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
