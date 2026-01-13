import { Token } from './types.ts';

export const BASE_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    price: 2450.25
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
    price: 1.00
  },
  {
    symbol: 'AERO',
    name: 'Aerodrome',
    address: '0x940181a94A3554032d847F159670fBf36C87C7E7',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/31592/small/aero.png',
    price: 0.85
  },
  {
    symbol: 'cbETH',
    name: 'Coinbase Wrapped Staked ETH',
    address: '0x2Ae3F1Ec7F1F5563d30F7057a731ad899384d1ad',
    decimals: 18,
    logoUrl: 'https://assets.coingecko.com/coins/images/27045/small/cbeth.png',
    price: 2680.12
  }
];

export const MOCK_CHART_DATA = [
  { time: '00:00', price: 2400 },
  { time: '04:00', price: 2420 },
  { time: '08:00', price: 2390 },
  { time: '12:00', price: 2450 },
  { time: '16:00', price: 2475 },
  { time: '20:00', price: 2440 },
  { time: '23:59', price: 2460 },
];