export interface User {
  id: string;
  email: string;
  username: string;
  balance: number;
  currency: string;
  isGuest: boolean;
  avatar?: string;
  createdAt: string;
}

export interface Wallet {
  address: string;
  balance: number;
  currency: string;
  connected: boolean;
}

export interface GameResult {
  id: string;
  game: string;
  betAmount: number;
  multiplier: number;
  payout: number;
  result: 'win' | 'loss';
  timestamp: string;
  provablyFair: {
    serverSeed: string;
    clientSeed: string;
    nonce: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BetHistory {
  id: string;
  game: string;
  amount: number;
  multiplier: number;
  profit: number;
  timestamp: number;
}

export interface GameConfig {
  minBet: number;
  maxBet: number;
  houseEdge: number;
}

export type GameType = 'crash' | 'dice' | 'mines' | 'plinko' | 'roulette' | 'coinflip';

export interface MinesCell {
  id: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
}

export interface PlinkoBucket {
  multiplier: number;
  color: string;
}

export interface RouletteBet {
  type: 'number' | 'color' | 'evenodd' | 'range';
  value: string | number;
  amount: number;
}
