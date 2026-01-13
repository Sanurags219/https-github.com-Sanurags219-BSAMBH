import React, { useState, useEffect } from 'react';
import { 
  Rocket, Sparkles, TrendingUp, ArrowLeftRight, Wand2, Menu, X, Share2, Check, Shield
} from 'lucide-react';
import { SwapCard } from './components/SwapCard.tsx';
import { PriceChart } from './components/PriceChart.tsx';
import { VibeLauncher } from './components/VibeLauncher.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { UserProfile } from './components/UserProfile.tsx';
import { sdk } from "@farcaster/miniapp-sdk";

import { WagmiProvider, useAccount, useConnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config.ts";

const queryClient = new QueryClient();

function AppContent() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [activeTab, setActiveTab] = useState<'swap' | 'launcher' | 'portfolio'>('swap');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    const initSdk = async () => {
      try {
        if (typeof sdk !== 'undefined' && sdk.actions) {
          console.log("BaseTech: Initializing Farcaster SDK...");
          await sdk.actions.ready();
        }
      } catch (e) {
        console.warn("BaseTech: Farcaster SDK init skipped (not in frame)");
      }
    };
    initSdk();
  }, []);

  const handleConnect = () => {
    if (connectors && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const handleShare = async () => {
    const shareData = { title: 'BaseTech Portal', url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error("Native share unavailable");
      }
    } catch (e) {
      console.log("BaseTech: Falling back to clipboard share.");
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (clipErr) {
        console.warn("Share failed completely:", clipErr);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-24 transition-colors duration-500">
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('swap')}>
            <div className="bg-[#0052FF] p-2 rounded-xl shadow-lg shadow-[#0052FF]/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">BASE<span className="text-[#0052FF]">TECH</span></h1>
              <p className="text-[8px] font-black tracking-[0.3em] opacity-40">L2 POWERED</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {[
              { id: 'swap', icon: ArrowLeftRight, label: 'Swap' },
              { id: 'launcher', icon: Wand2, label: 'Launch' },
              { id: 'portfolio', icon: TrendingUp, label: 'Asset' }
            ].map((nav) => (
              <button 
                key={nav.id} 
                onClick={() => setActiveTab(nav.id as any)} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === nav.id ? 'bg-[#0052FF] text-white' : 'hover:bg-white/10 opacity-60 hover:opacity-100'}`}
              >
                <nav.icon className="w-4 h-4" />
                {nav.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
             <button onClick={handleShare} className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2">
                {isShared ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                {isShared && <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Copied</span>}
             </button>
             <button onClick={handleConnect} className="hidden sm:flex px-5 py-2.5 bg-[#0052FF] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0042CC] transition-all shadow-lg">
                {isConnected ? address?.slice(0, 6) + '...' : 'Connect'}
             </button>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/5">
                {isMobileMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isConnected && <UserProfile />}
        
        {activeTab === 'swap' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <PriceChart />
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-5 h-5 text-[#0052FF]" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Base Network Safe</h3>
                </div>
                <p className="text-sm opacity-60">Verified Liquidity Pools detected across Base L2 chain.</p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <SwapCard onSwapComplete={() => setActiveTab('portfolio')} />
            </div>
          </div>
        )}

        {activeTab === 'launcher' && <VibeLauncher />}
        {activeTab === 'portfolio' && <Portfolio />}
      </main>

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-2xl z-50">
        <button onClick={() => setActiveTab('swap')} className={`p-4 rounded-2xl transition-all ${activeTab === 'swap' ? 'bg-[#0052FF] text-white' : 'opacity-40'}`}><ArrowLeftRight /></button>
        <button onClick={() => setActiveTab('launcher')} className={`p-4 rounded-2xl transition-all ${activeTab === 'launcher' ? 'bg-[#0052FF] text-white' : 'opacity-40'}`}><Wand2 /></button>
        <button onClick={() => setActiveTab('portfolio')} className={`p-4 rounded-2xl transition-all ${activeTab === 'portfolio' ? 'bg-[#0052FF] text-white' : 'opacity-40'}`}><TrendingUp /></button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}