
export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl: string;
  price: number;
  balance?: string;
}

export interface SwapState {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  slippage: number;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}
