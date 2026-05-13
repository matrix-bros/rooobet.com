'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { X, Eye, EyeOff, Wallet, User } from 'lucide-react'

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, setUser, setAuthenticated, setWallet } = useStore()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalTab)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (activeTab === 'register' && !formData.username) {
      setError('Username is required')
      setIsLoading(false)
      return
    }

    // Create user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      username: formData.username || formData.email.split('@')[0],
      balance: 10000,
      currency: 'USD',
      isGuest: false,
      createdAt: new Date().toISOString(),
    }

    setUser(user)
    setAuthenticated(true)
    setIsLoading(false)
    closeAuthModal()
  }

  const handleGuest = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))

    const guestUser = {
      id: 'guest-' + Math.random().toString(36).substr(2, 9),
      email: '',
      username: 'Guest' + Math.floor(Math.random() * 10000),
      balance: 10000,
      currency: 'USD',
      isGuest: true,
      createdAt: new Date().toISOString(),
    }

    setUser(guestUser)
    setAuthenticated(true)
    setIsLoading(false)
    closeAuthModal()
  }

  const handleMetaMask = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200))

    const address = '0x' + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')

    const user = {
      id: 'wallet-' + Math.random().toString(36).substr(2, 9),
      email: '',
      username: 'WalletUser' + Math.floor(Math.random() * 1000),
      balance: 5.5,
      currency: 'ETH',
      isGuest: false,
      createdAt: new Date().toISOString(),
    }

    setUser(user)
    setWallet({
      address,
      balance: 5.5,
      currency: 'ETH',
      connected: true,
    })
    setAuthenticated(true)
    setIsLoading(false)
    closeAuthModal()
  }

  if (!authModalOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md bg-surface border border-border rounded-xl p-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1 bg-background rounded-lg p-1">
              <button
                onClick={() => setActiveTab('register')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'register' ? 'bg-accent text-black' : 'text-text-secondary hover:text-white'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setActiveTab('login')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'login' ? 'bg-accent text-black' : 'text-text-secondary hover:text-white'
                }`}
              >
                Login
              </button>
            </div>
            <button onClick={closeAuthModal} className="p-1 text-text-secondary hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <div>
                <label className="block text-sm text-text-secondary mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-md text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
                    placeholder="Enter username"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-text-secondary mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-md text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-accent text-black font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : activeTab === 'register' ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={handleMetaMask}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-border rounded-md text-white text-sm hover:bg-[#2a2a2a] transition-colors"
            >
              <Wallet className="w-4 h-4 text-orange-500" />
              MetaMask
            </button>
            <button
              onClick={handleGuest}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border rounded-md text-text-secondary text-sm hover:text-white hover:bg-surface transition-colors"
            >
              <User className="w-4 h-4" />
              Play as Guest
            </button>
          </div>

          <p className="text-xs text-text-secondary text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
