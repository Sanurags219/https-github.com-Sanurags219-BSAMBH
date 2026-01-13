
import React from 'react';
import { useAccount } from 'wagmi';
import { Wallet, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { theme } from '../styles/theme.ts';

export const UserProfile: React.FC = () => {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) return null;

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // Simple toast could be added here
  };

  return (
    <div className={`${theme.glass} p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0052FF] to-[#00C2FF] flex items-center justify-center shadow-lg transform rotate-3">
            <Wallet className="w-8 h-8 text-white -rotate-3" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-[var(--color-bg)]">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            Base Explorer
            <span className="text-[10px] bg-[#0052FF]/10 text-[#0052FF] px-2 py-0.5 rounded-full uppercase tracking-widest">Verified</span>
          </h2>
          <div className="flex items-center gap-2 text-[var(--color-text-dim)] font-mono text-sm">
            {truncatedAddress}
            <button onClick={copyAddress} className="hover:text-[#0052FF] transition-colors"><Copy className="w-3 h-3" /></button>
            <a href={`https://basescan.org/address/${address}`} target="_blank" rel="noreferrer" className="hover:text-[#0052FF] transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <div className="flex-1 md:w-32 bg-[var(--color-surface)] p-3 rounded-2xl border border-[var(--color-border)] text-center">
          <div className="text-[10px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Net Worth</div>
          <div className="text-lg font-black">$12,450</div>
        </div>
        <div className="flex-1 md:w-32 bg-[var(--color-surface)] p-3 rounded-2xl border border-[var(--color-border)] text-center">
          <div className="text-[10px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Transactions</div>
          <div className="text-lg font-black">142</div>
        </div>
      </div>
    </div>
  );
};
