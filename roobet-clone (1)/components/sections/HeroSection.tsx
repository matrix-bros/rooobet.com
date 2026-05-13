'use client'

import { useStore } from '@/lib/store'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const { openAuthModal } = useStore()

  return (
    <section className="relative w-full h-[400px] rounded-xl overflow-hidden mb-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974765270-ca1258634369?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-12">
        <div className="flex-1">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Welcome To Roobet
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary mb-6"
          >
            Hop In
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => openAuthModal('register')}
            className="w-full max-w-md h-12 bg-accent text-black font-bold rounded-lg hover:scale-105 hover:brightness-110 transition-all mb-4"
          >
            Register Now
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center max-w-md"
          >
            <p className="text-text-secondary text-sm mb-3">Or continue with</p>
            <div className="flex gap-3 justify-center">
              <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-md text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1b2838] rounded-md text-white font-medium text-sm hover:bg-[#2a3f54] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                Steam
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-md text-white font-medium text-sm hover:bg-[#2a2a2a] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#E17726"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#E27625"/>
                </svg>
                MetaMask
              </button>
            </div>
          </motion.div>
        </div>

        {/* Fighter Image */}
        <div className="hidden lg:block absolute right-0 bottom-0 w-[400px] h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-purple-900/50" />
          <img 
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400&h=400&fit=crop" 
            alt="Fighter" 
            className="w-full h-full object-cover object-top opacity-80 mix-blend-luminosity"
          />
        </div>
      </div>
    </section>
  )
}
