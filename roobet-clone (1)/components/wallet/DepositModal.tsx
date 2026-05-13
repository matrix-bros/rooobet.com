'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X, Copy, Check, QrCode, Wallet } from 'lucide-react'
import { formatAddress } from '@/lib/utils'

export default function DepositModal() {
  const { depositModalOpen, closeDepositModal, user, updateBalance } = useStore()
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const address = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const simulateDeposit = async () => {
    if (!amount || Number(amount) <= 0) return
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    updateBalance(Number(amount))
    setIsProcessing(false)
    closeDepositModal()
  }

  if (!depositModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeDepositModal}
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
              <Wallet className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-white">Deposit</h2>
            </div>
            <button onClick={closeDepositModal} className="p-1 text-text-secondary hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center mb-4">
            <div className="w-40 h-40 bg-white rounded-xl p-2 flex items-center justify-center">
              <QrCode className="w-32 h-32 text-black" />
            </div>
          </div>

          {/* Address */}
          <div className="p-3 bg-background rounded-lg mb-4">
            <p className="text-xs text-text-secondary mb-1">Deposit Address</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white flex-1 truncate font-mono">{address}</span>
              <button onClick={copyAddress} className="p-1.5 text-text-secondary hover:text-white">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Demo Deposit */}
          <div className="space-y-2">
            <label className="text-sm text-text-secondary">Demo Deposit Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-white focus:outline-none focus:border-accent"
            />
            <button
              onClick={simulateDeposit}
              disabled={isProcessing || !amount}
              className="w-full h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Simulate Deposit'}
            </button>
          </div>

          <p className="text-xs text-text-secondary text-center mt-4">
            Send only ETH to this address. Other tokens may be lost.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
