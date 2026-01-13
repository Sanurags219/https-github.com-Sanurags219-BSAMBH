
import React, { useState } from 'react';
import { Share2, Check, Zap, ExternalLink, Shield, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { theme } from '../styles/theme.ts';

interface MintedToken {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  timestamp: string;
  deployer: string;
  mcap: string;
  growth: string;
}

const MOCK_MINTS: MintedToken[] = [
  {
    id: '1',
    name: 'NeoBase Oracle',
    symbol: 'NBO',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=NBO',
    timestamp: '2m ago',
    deployer: '0x71C...4e21',
    mcap: '$420K',
    growth: '+12.5%'
  },
  {
    id: '2',
    name: 'Quantum Flow',
    symbol: 'QFL',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=QFL',
    timestamp: '5m ago',
    deployer: '0x12A...9b33',
    mcap: '$1.2M',
    growth: '+84.2%'
  },
  {
    id: '3',
    name: 'Basetech Infinity',
    symbol: 'BTI',
    logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=BTI',
    timestamp: '12m ago',
    deployer: '0x33D...1f90',
    mcap: '$89K',
    growth: '+5.1%'
  }
];

export const LiveMints: React.FC<{ onSelectToken?: (symbol: string) => void }> = ({ onSelectToken }) => {
  const [sharedId, setSharedId] = useState<string | null>(null);

  const handleShare = async (token: MintedToken) => {
    // Generate a viral deep-link for the mini-app
    const deepLink = `${window.location.origin}?token=${token.symbol}`;
    
    const shareMessage = `🚀 BASE ALPHA DETECTED 🚀

Asset: ${token.name} ($${token.symbol})
Market Cap: ${token.mcap}
Momentum: ${token.growth} 📈

This gem was just deployed via #BaseTech on the @base chain. 
Dive into the analytics here: ${deepLink}

#BaseChain #ClankerV4 #DeFi #L2Gems`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `BaseTech Alpha: ${token.symbol}`,
          text: shareMessage,
          url: deepLink,
        });
      } else {
        await navigator.clipboard.writeText(shareMessage);
        setSharedId(token.id);
        setTimeout(() => setSharedId(null), 2000);
      }
    } catch (err) {
      console.warn("BaseTech Share: Execution Error", err);
    }
  };

  return (
    <div className={`${theme.glass} p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden`}>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0052FF]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#0052FF]/10 p-2.5 rounded-2xl">
            <Zap className="w-5 h-5 text-[#0052FF] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight uppercase leading-none text-white">Live <span className="text-[#0052FF]">Mints</span></h3>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--color-text-dim)] mt-1">Global Clanker V4 Stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           <span className="text-[9px] font-black uppercase text-green-500 tracking-widest">Live Flow</span>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_MINTS.map((token) => (
          <div 
            key={token.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/[0.08] hover:border-[#0052FF]/20 transition-all group relative gap-4"
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-[#0052FF]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={token.logo} alt={token.name} className="w-14 h-14 rounded-2xl shadow-2xl relative z-10 border border-white/10" />
                <div className="absolute -bottom-1 -right-1 bg-[#0052FF] p-1.5 rounded-xl border-2 border-[#030303] z-20 shadow-lg">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                   <span className="font-black text-lg leading-none group-hover:text-[#0052FF] transition-colors text-white">{token.name}</span>
                   <span className="text-[10px] font-black text-[#00C2FF] bg-[#00C2FF]/5 px-2 py-0.5 rounded-lg border border-[#00C2FF]/10">${token.symbol}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 text-yellow-500/50" />
                    <span className="text-[10px] font-black text-white/60">{token.mcap}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-black text-green-500">{token.growth}</span>
                  </div>
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{token.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button 
                onClick={() => handleShare(token)}
                className={`flex items-center gap-2 px-5 py-3 rounded-[1.25rem] transition-all relative overflow-hidden group/btn ${sharedId === token.id ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white/5 hover:bg-[#0052FF] hover:text-white border border-white/10 hover:border-[#0052FF] text-white'}`}
              >
                {sharedId === token.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Alpha Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Share Alpha</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={() => onSelectToken?.(token.symbol)}
                className="p-3.5 rounded-[1.25rem] bg-white/5 border border-white/10 hover:border-[#0052FF]/40 text-white/40 hover:text-white transition-all active:scale-90"
                title="View Full Profile"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-4 rounded-[1.5rem] border border-dashed border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-dim)] hover:text-[#0052FF] hover:border-[#0052FF]/40 hover:bg-[#0052FF]/5 transition-all flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3" /> Scan Network Deployments
      </button>
    </div>
  );
};
