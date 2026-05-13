# Roobet Clone - Crypto Casino

A complete, fully functional crypto casino web application built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. This is a professional-grade clone of the Roobet interface with real backend simulation and functional crypto wallet integration.

## Features

### Authentication System
- Email/password registration and login
- Guest mode with 10,000 demo credits
- MetaMask wallet connection simulation
- JWT token-based authentication
- Persistent auth state across reloads

### Crypto Wallet Integration
- MetaMask connect/disconnect simulation
- Wallet address display (0x1234...5678 format)
- ETH/BTC balance fetching (simulated)
- Deposit modal with QR code generation
- Withdrawal modal with address input
- Transaction history table

### Functional Games (All Playable)
1. **Crash** - Graph curve rising with cash-out mechanics
2. **Dice** - Slider-based over/under betting
3. **Mines** - 5x5 grid with configurable mine count
4. **Plinko** - Ball drop physics simulation
5. **Roulette** - Spinning wheel with red/black/number betting
6. **Coinflip** - 3D coin rotation with heads/tails

### Game Features
- Real balance updates on every bet
- Win/loss animations
- Provably Fair verification popup
- Bet history tracking
- House edge: 1% (2.7% for Roulette)

### UI/UX
- Dark obsidian theme (#0B0E14)
- Golden yellow accent (#FACC15)
- Fixed sidebar (260px) with live bet counter
- Fixed header with auth buttons
- Hero section with social login
- Promo banner with countdown timer
- Feature cards with hover effects
- Horizontal scrolling game carousel
- Floating chat support button
- Responsive design (desktop/tablet/mobile)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom design tokens
- **State**: Zustand (global state management)
- **Animations**: Framer Motion
- **Charts**: Recharts (for Crash game graph)
- **Query**: TanStack Query (server state)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd roobet-clone

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_NAME=Roobet Clone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Project Structure

```
roobet-clone/
├── app/
│   ├── api/
│   │   ├── auth/route.ts       # Authentication API
│   │   ├── wallet/route.ts     # Wallet API
│   │   └── games/route.ts      # Games API
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── auth/
│   │   └── AuthModal.tsx       # Login/Register modal
│   ├── games/
│   │   ├── GameModal.tsx       # Game wrapper
│   │   ├── CrashGame.tsx       # Crash game
│   │   ├── DiceGame.tsx        # Dice game
│   │   ├── MinesGame.tsx       # Mines game
│   │   ├── PlinkoGame.tsx      # Plinko game
│   │   ├── RouletteGame.tsx    # Roulette game
│   │   └── CoinflipGame.tsx    # Coinflip game
│   ├── layout/
│   │   ├── Header.tsx          # Top navigation
│   │   └── Sidebar.tsx         # Left sidebar
│   ├── sections/
│   │   ├── HeroSection.tsx     # Hero banner
│   │   ├── PromoBanner.tsx     # Promo section
│   │   ├── FeatureCards.tsx    # Casino/Sports cards
│   │   └── OriginalsCarousel.tsx # Game carousel
│   ├── wallet/
│   │   ├── WalletModal.tsx     # Wallet overview
│   │   ├── DepositModal.tsx    # Deposit modal
│   │   └── WithdrawModal.tsx   # Withdraw modal
│   ├── ChatButton.tsx          # Floating chat
│   ├── FairnessModal.tsx       # Provably Fair popup
│   └── providers.tsx           # App providers
├── lib/
│   ├── store.ts                # Zustand store
│   ├── utils.ts                # Utility functions
│   └── constants.ts            # App constants
├── types/
│   └── index.ts                # TypeScript types
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind config
├── next.config.js              # Next.js config
└── package.json                # Dependencies
```

## Game Mechanics

### Crash
- Multiplier starts at 1.00x and increases exponentially
- Cash out before the crash to win
- Crash point calculated with 1% house edge
- Real-time canvas graph visualization

### Dice
- Set target number (2-98)
- Choose Roll Over or Roll Under
- Payout calculated as (100/target) * 0.99
- Instant result with animation

### Mines
- 5x5 grid with configurable mine count (1-24)
- Click tiles to reveal gems
- Cash out anytime to secure winnings
- Multiplier increases with each safe tile

### Plinko
- Ball drops through pegs
- Lands in multiplier buckets
- 13 buckets with varying multipliers
- CSS animation for ball trajectory

### Roulette
- Bet on red, black, even, odd, low, high, or specific numbers
- 3D spinning wheel animation
- European roulette (single zero)
- 2.7% house edge

### Coinflip
- Choose Heads or Tails
- 3D coin flip animation
- 1.98x payout (1% house edge)
- Instant result

## Demo Mode

All games work in demo mode without real crypto:
- Register as guest for 10,000 demo credits
- Or connect MetaMask for simulated ETH balance
- All bets update balance in real-time
- Full transaction history maintained

## Responsive Breakpoints

- **Desktop** (>1024px): Full sidebar, all features
- **Tablet** (768px-1024px): Collapsible sidebar to icons
- **Mobile** (<768px): Bottom navigation, hamburger menu

## Security Notes

This is a demo application. For production:
- Replace in-memory storage with PostgreSQL + Prisma
- Implement real WebSocket connections
- Add proper input validation
- Use httpOnly cookies for JWT
- Implement rate limiting
- Add KYC/AML compliance features

## License

MIT License - For educational purposes only. Gambling involves risk. Please gamble responsibly.

## Credits

Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.
