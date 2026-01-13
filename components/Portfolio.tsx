import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Wallet, Layers, ShieldCheck, Loader2 } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { theme } from '../styles/theme.ts';

const MOCK_ASSETS = [
  { name: 'Ethereum', symbol: 'ETH', value: 4500.25, amount: '1.83', color: '#627EEA', change: 2.4 },
  { name: 'USDC', symbol: 'USDC', value: 3200.00, amount: '3,200', color: '#2775CA', change: 0.0 },
  { name: 'Aerodrome', symbol: 'AERO', value: 1250.40, amount: '1,471', color: '#0052FF', change: 12.8 },
  { name: 'cbETH', symbol: 'cbETH', value: 850.12, amount: '0.31', color: '#7895FF', change: -0.5 }
];

export const Portfolio: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className={`${theme.glass} p-8 rounded-[2.5rem] relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-700">
              <TrendingUp className="w-48 h-48" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-10">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--color-text-dim)]">Onchain Balance</span>
                <h2 className="text-5xl font-black tracking-tighter mt-1 tabular-nums">
                  {isBalanceLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : 
                   isConnected ? `${balance?.formatted.slice(0, 8)} ${balance?.symbol}` : '$0.00'}
                </h2>
              </div>
              {isConnected && (
                <div className="flex items-center gap-2 mb-2 px-4 py-1.5 bg-green-500/10 text-green-500 rounded-2xl text-sm font-black uppercase tracking-wider">
                  <ArrowUpRight className="w-4 h-4" />
                  Live
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 relative z-10">
              {[
                { label: 'Network', val: 'Base Mainnet', color: 'text-[#0052FF]' },
                { label: 'Asset Standard', val: 'ERC-20', color: 'text-white' },
                { label: 'Yield Ops', val: 'Available', color: 'text-green-500' },
                { label: 'Security', val: 'Verified', color: 'text-blue-500' }
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)] mb-1">{stat.label}</div>
                  <div className={`text-sm font-black ${stat.color}`}>{stat.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${theme.glass} p-8 rounded-[2.5rem]`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#0052FF]/10 p-2.5 rounded-2xl">
                  <Layers className="w-5 h-5 text-[#0052FF]" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Portfolio Tracker</h3>
              </div>
            </div>

            <div className="space-y-4">
              {MOCK_ASSETS.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[#0052FF]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white" style={{ backgroundColor: asset.color }}>
                      {asset.symbol[0]}
                    </div>
                    <div>
                      <div className="font-black text-lg">{asset.name}</div>
                      <div className="text-xs text-[var(--color-text-dim)] font-bold">{asset.amount} {asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-lg tabular-nums">${asset.value.toLocaleString()}</div>
                    <div className={`flex items-center justify-end gap-1 text-xs font-black ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(asset.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Allocation Chart */}
        <div className="space-y-8">
          <div className={`${theme.glass} p-8 rounded-[2.5rem] h-full flex flex-col`}>
            <h3 className="text-lg font-black tracking-tight mb-8">Asset Spread</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_ASSETS}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {MOCK_ASSETS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: '900', background: 'var(--color-bg)', color: 'var(--color-text)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-8 p-6 rounded-3xl bg-[#0052FF]/10 border border-[#0052FF]/20 text-center relative overflow-hidden">
              <ShieldCheck className="absolute -bottom-2 -right-2 w-16 h-16 opacity-5 pointer-events-none" />
              <div className="bg-[#0052FF] p-2 rounded-xl w-fit mx-auto mb-3 shadow-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-[var(--color-text-dim)] font-bold leading-relaxed">
                Connect your <span className="text-[#0052FF] font-black">Coinbase Wallet</span> or <span className="text-[#0052FF] font-black">Farcaster</span> account to sync full historical data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};