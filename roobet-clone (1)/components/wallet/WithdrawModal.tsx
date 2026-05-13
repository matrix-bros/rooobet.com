'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X, ArrowUpRight, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function WithdrawModal() {
  const { withdrawModalOpen, closeWithdrawModal, user, updateBalance } = useStore()
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleWithdraw = async () => {
    if (!address || !amount || Number(amount) <= 0 || !user || user.balance < Number(amount)) return
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    updateBalance(-Number(amount))
    setIsProcessing(false)
    closeWithdrawModal()
  }

  if (!withdrawModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeWithdrawModal}
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
              <ArrowUpRight className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-bold text-white">Withdraw</h2>
            </div>
            <button onClick={closeWithdrawModal} className="p-1 text-text-secondary hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {user && (
            <div className="p-3 bg-background rounded-lg mb-4">
              <p className="text-xs text-text-secondary">Available Balance</p>
              <p className="text-lg font-bold text-white">{formatCurrency(user.balance, user.currency)}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary mb-1 block">Withdrawal Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary mb-1 block">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 bg-background border border-border rounded-md text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <p className="text-xs text-yellow-400">
                Minimum withdrawal: 0.001 ETH. Network fee: 0.0005 ETH
              </p>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isProcessing || !address || !amount || (user ? user.balance < Number(amount) : true)}
              className="w-full h-11 bg-red-500 text-white font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
