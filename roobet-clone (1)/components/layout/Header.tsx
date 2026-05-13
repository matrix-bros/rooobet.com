'use client'

import { useStore } from '@/lib/store'
import { Search, LogIn, UserPlus, Wallet, ChevronDown } from 'lucide-react'
import { formatCurrency, formatAddress } from '@/lib/utils'

export default function Header() {
  const { user, isAuthenticated, wallet, openAuthModal, openWalletModal, openDepositModal } = useStore()

  return (
    <header className="fixed top-0 left-0 right-0 h-header bg-background/95 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-accent to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.22-7.52-3.22 7.52 3.22z"/>
          </svg>
        </div>
        <span className="text-xl font-bold tracking-wider text-white">ROOBET</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-text-secondary hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            {wallet?.connected && (
              <button 
                onClick={openWalletModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm text-text-secondary hover:text-white transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>{formatAddress(wallet.address)}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}
            <button 
              onClick={openDepositModal}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-md text-sm font-medium text-white hover:bg-surface-elevated transition-colors"
            >
              <span className="text-accent">{formatCurrency(user.balance, user.currency)}</span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openAuthModal('login')}
              className="btn-secondary text-sm font-medium flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button 
              onClick={() => openAuthModal('register')}
              className="btn-primary text-sm font-medium flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
