'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Wallet, BetHistory, GameType } from '@/types'

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  authModalOpen: boolean
  authModalTab: 'login' | 'register'

  // Wallet
  wallet: Wallet | null
  walletModalOpen: boolean

  // Games
  activeGame: GameType | null
  gameModalOpen: boolean
  betHistory: BetHistory[]

  // UI
  sidebarOpen: boolean
  depositModalOpen: boolean
  withdrawModalOpen: boolean
  fairnessModalOpen: boolean
  currentProvablyFair: { serverSeed: string; clientSeed: string; nonce: number } | null

  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (value: boolean) => void
  openAuthModal: (tab?: 'login' | 'register') => void
  closeAuthModal: () => void
  logout: () => void

  setWallet: (wallet: Wallet | null) => void
  openWalletModal: () => void
  closeWalletModal: () => void

  setActiveGame: (game: GameType | null) => void
  openGameModal: (game: GameType) => void
  closeGameModal: () => void
  addBet: (bet: BetHistory) => void
  updateBalance: (amount: number) => void

  setSidebarOpen: (open: boolean) => void
  openDepositModal: () => void
  closeDepositModal: () => void
  openWithdrawModal: () => void
  closeWithdrawModal: () => void
  openFairnessModal: (data: { serverSeed: string; clientSeed: string; nonce: number }) => void
  closeFairnessModal: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authModalOpen: false,
      authModalTab: 'register',

      wallet: null,
      walletModalOpen: false,

      activeGame: null,
      gameModalOpen: false,
      betHistory: [],

      sidebarOpen: true,
      depositModalOpen: false,
      withdrawModalOpen: false,
      fairnessModalOpen: false,
      currentProvablyFair: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      openAuthModal: (tab = 'register') => set({ authModalOpen: true, authModalTab: tab }),
      closeAuthModal: () => set({ authModalOpen: false }),
      logout: () => set({ user: null, isAuthenticated: false, wallet: null }),

      setWallet: (wallet) => set({ wallet }),
      openWalletModal: () => set({ walletModalOpen: true }),
      closeWalletModal: () => set({ walletModalOpen: false }),

      setActiveGame: (game) => set({ activeGame: game }),
      openGameModal: (game) => set({ activeGame: game, gameModalOpen: true }),
      closeGameModal: () => set({ activeGame: null, gameModalOpen: false }),
      addBet: (bet) => set((state) => ({ betHistory: [bet, ...state.betHistory].slice(0, 50) })),
      updateBalance: (amount) => set((state) => ({
        user: state.user ? { ...state.user, balance: state.user.balance + amount } : null
      })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      openDepositModal: () => set({ depositModalOpen: true }),
      closeDepositModal: () => set({ depositModalOpen: false }),
      openWithdrawModal: () => set({ withdrawModalOpen: true }),
      closeWithdrawModal: () => set({ withdrawModalOpen: false }),
      openFairnessModal: (data) => set({ fairnessModalOpen: true, currentProvablyFair: data }),
      closeFairnessModal: () => set({ fairnessModalOpen: false, currentProvablyFair: null }),
    }),
    {
      name: 'roobet-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, wallet: state.wallet, betHistory: state.betHistory }),
    }
  )
)
