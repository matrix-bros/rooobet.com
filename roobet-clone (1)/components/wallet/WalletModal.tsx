'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X, Copy, Check, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react'
import { formatAddress, formatCurrency } from '@/lib/utils'

export default function WalletModal() {
  const { walletModalOpen, closeWalletModal, wallet, user } = useStore()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!walletModalOpen || !wallet) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeWalletModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-surface border border-border rounded-xl p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Wallet</h2>
            <button onClick={closeWalletModal} className="p-1 text-text-secondary hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-text-secondary mb-1">Total Balance</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(wallet.balance, wallet.currency)}</p>
            <p className="text-sm text-text-secondary">≈ ${(wallet.balance * 3500).toFixed(2)} USD</p>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg mb-4">
            <span className="text-sm text-text-secondary flex-1 truncate">
              {formatAddress(wallet.address)}
            </span>
            <button onClick={copyAddress} className="p-1.5 text-text-secondary hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-background rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'overview' ? 'bg-surface text-white' : 'text-text-secondary'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'history' ? 'bg-surface text-white' : 'text-text-secondary'
              }`}
            >
              History
            </button>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Deposit</p>
                  <p className="text-xs text-text-secondary">Receive crypto to your wallet</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Withdraw</p>
                  <p className="text-xs text-text-secondary">Send crypto to external wallet</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i % 2 === 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {i % 2 === 0 ? <ArrowDownLeft className="w-4 h-4 text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{i % 2 === 0 ? 'Deposit' : 'Withdrawal'}</p>
                    <p className="text-xs text-text-secondary flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {i} hours ago
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${i % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {i % 2 === 0 ? '+' : '-'}{formatCurrency(Math.random() * 0.5, 'ETH')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
