export const GAMES = [
  { id: 'crash', name: 'Crash', rtp: '99%', image: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=400&h=300&fit=crop', color: 'from-red-500 to-orange-600' },
  { id: 'dice', name: 'Dice', rtp: '99%', image: 'https://images.unsplash.com/photo-1518710843675-2540ddc7b6b2?w=400&h=300&fit=crop', color: 'from-blue-500 to-cyan-600' },
  { id: 'mines', name: 'Mines', rtp: '99%', image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop', color: 'from-purple-500 to-violet-600' },
  { id: 'plinko', name: 'Plinko', rtp: '99%', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop', color: 'from-green-500 to-emerald-600' },
  { id: 'roulette', name: 'Roulette', rtp: '97.3%', image: 'https://images.unsplash.com/photo-1596832817342-5432eb3200a6?w=400&h=300&fit=crop', color: 'from-yellow-500 to-amber-600' },
  { id: 'coinflip', name: 'Coinflip', rtp: '99%', image: 'https://images.unsplash.com/photo-1565453006698-a17d83b9e2af?w=400&h=300&fit=crop', color: 'from-gray-500 to-slate-600' },
] as const

export const GAME_CONFIGS = {
  crash: { minBet: 0.000001, maxBet: 5, houseEdge: 0.01 },
  dice: { minBet: 0.000001, maxBet: 5, houseEdge: 0.01 },
  mines: { minBet: 0.000001, maxBet: 5, houseEdge: 0.01 },
  plinko: { minBet: 0.000001, maxBet: 5, houseEdge: 0.01 },
  roulette: { minBet: 0.000001, maxBet: 5, houseEdge: 0.027 },
  coinflip: { minBet: 0.000001, maxBet: 5, houseEdge: 0.01 },
}

export const SIDEBAR_ITEMS = [
  {
    label: 'Casino',
    icon: 'Dice5',
    expandable: true,
    children: [
      { label: 'Roobet Casino', href: '/' },
      { label: 'Popular', href: '/?filter=popular' },
      { label: 'Slots', href: '/?filter=slots' },
      { label: 'Bonus Buys', href: '/?filter=bonus' },
      { label: 'Live Casino', href: '/?filter=live' },
      { label: 'Game Shows', href: '/?filter=shows' },
      { label: 'Roulette', href: '/games/roulette' },
      { label: 'Blackjack', href: '/?filter=blackjack' },
      { label: 'Baccarat', href: '/?filter=baccarat' },
    ]
  },
  { label: 'Sportsbook', icon: 'Trophy', expandable: true },
  { label: 'Promotions', icon: 'Gift', href: '/promotions' },
  { label: 'Refer & Earn', icon: 'Users', href: '/refer' },
  { label: 'Redeem', icon: 'Ticket', href: '/redeem' },
  { label: 'Free Play', icon: 'Gamepad2', href: '/freeplay' },
  { label: 'VIP', icon: 'Crown', href: '/vip' },
  { label: 'Live Support', icon: 'MessageCircle', href: '/support' },
  { label: 'English', icon: 'Globe', href: '/language' },
]

export const INITIAL_BET_COUNT = 4655352469
