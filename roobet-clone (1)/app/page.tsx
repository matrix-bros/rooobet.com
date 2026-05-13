import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import HeroSection from '@/components/sections/HeroSection'
import PromoBanner from '@/components/sections/PromoBanner'
import FeatureCards from '@/components/sections/FeatureCards'
import OriginalsCarousel from '@/components/sections/OriginalsCarousel'
import AuthModal from '@/components/auth/AuthModal'
import WalletModal from '@/components/wallet/WalletModal'
import DepositModal from '@/components/wallet/DepositModal'
import WithdrawModal from '@/components/wallet/WithdrawModal'
import GameModal from '@/components/games/GameModal'
import FairnessModal from '@/components/FairnessModal'
import ChatButton from '@/components/ChatButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="ml-0 lg:ml-sidebar pt-header min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">
          <HeroSection />
          <PromoBanner />
          <FeatureCards />
          <OriginalsCarousel />
        </div>
      </main>

      <AuthModal />
      <WalletModal />
      <DepositModal />
      <WithdrawModal />
      <GameModal />
      <FairnessModal />
      <ChatButton />
    </div>
  )
}
