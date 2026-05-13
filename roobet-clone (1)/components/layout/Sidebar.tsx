'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { SIDEBAR_ITEMS, INITIAL_BET_COUNT } from '@/lib/constants'
import { 
  Dice5, Trophy, Gift, Users, Ticket, Gamepad2, Crown, 
  MessageCircle, Globe, ChevronDown, ChevronRight, Menu, X
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  Dice5: <Dice5 className="w-4 h-4" />,
  Trophy: <Trophy className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Ticket: <Ticket className="w-4 h-4" />,
  Gamepad2: <Gamepad2 className="w-4 h-4" />,
  Crown: <Crown className="w-4 h-4" />,
  MessageCircle: <MessageCircle className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, openAuthModal } = useStore()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Casino'])
  const [betCount, setBetCount] = useState(INITIAL_BET_COUNT)

  useEffect(() => {
    const interval = setInterval(() => {
      setBetCount(prev => prev + Math.floor(Math.random() * 50) + 10)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  return (
    <>
      {/* Mobile toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-40 lg:hidden p-2 bg-surface border border-border rounded-md text-white"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside className={`
        fixed left-0 top-header bottom-0 w-sidebar bg-sidebar border-r border-sidebar-border 
        overflow-y-auto scrollbar-hide z-30 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => item.expandable ? toggleExpand(item.label) : undefined}
                className={`sidebar-item w-full ${item.expandable && expandedItems.includes(item.label) ? 'text-white bg-white/5' : ''}`}
              >
                {iconMap[item.icon]}
                <span className="flex-1 text-left">{item.label}</span>
                {item.expandable && (
                  expandedItems.includes(item.label) 
                    ? <ChevronDown className="w-4 h-4" />
                    : <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {item.expandable && expandedItems.includes(item.label) && item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <a
                      key={child.label}
                      href={child.href || '#'}
                      className="sidebar-item text-xs py-2"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          <div className="text-xs text-text-secondary mb-1">Total Bets Placed</div>
          <div className="text-lg font-bold text-accent font-mono tabular-nums">
            {betCount.toLocaleString()}
          </div>
        </div>
      </aside>
    </>
  )
}
