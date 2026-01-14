
import React, { useState, useEffect } from 'react';
import { 
  Rocket, Sparkles, TrendingUp, ArrowLeftRight, Wand2, Menu, X, Share2, Check, Shield, Info, Activity, Mic, Zap
} from 'lucide-react';
import { SwapCard } from './components/SwapCard.tsx';
import { PriceChart } from './components/PriceChart.tsx';
import { VibeLauncher } from './components/VibeLauncher.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { UserProfile } from './components/UserProfile.tsx';
import { LiveMints } from './components/LiveMints.tsx';
import { VoiceAssistant } from './components/VoiceAssistant.tsx';
import { sdk } from "@farcaster/miniapp-sdk";
import { theme } from './styles/theme.ts';
import { getBaseEcosystemAlpha } from './services/geminiService.ts';

// Correctly import QueryClient and QueryClientProvider from @tanstack/react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useAccount, useConnect } from "wagmi";
import { config } from "./config.ts";

// Initialize the query client for Wagmi and React Query integration
const queryClient = new QueryClient();

function AppContent() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const [activeTab, setActiveTab] = useState<'swap' | 'launcher' | 'portfolio'>('swap');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string | null>(null);
  const [showVoiceOracle, setShowVoiceOracle] = useState(false);
  const [alphaContent, setAlphaContent] = useState<{ text: string; sources: any[] } | null>(null);

  useEffect(() => {
    const fetchAlpha = async () => {
      const data = await getBaseEcosystemAlpha();
      setAlphaContent(data);
    };
    fetchAlpha();

    // Detect deep links from Alpha shares
    const params = new URLSearchParams(window.location.search);
    const sharedToken = params.get('token');
    if (sharedToken) {
      setSelectedTokenSymbol(sharedToken.toUpperCase());
    }

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

  const handleShareMain = async () => {
    const shareData = { title: 'BaseTech Portal', url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error("Native share unavailable");
      }
    } catch (e) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (clipErr) {
        console.warn("Share failed:", clipErr);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans pb-24 transition-colors duration-500 overflow-x-hidden">
      {showVoiceOracle && <VoiceAssistant onClose={() => setShowVoiceOracle(false)} />}
      
      <header className="sticky top-0 z-[100] border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab('swap'); setSelectedTokenSymbol(null); }}>
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
                onClick={() => { setActiveTab(nav.id as any); setSelectedTokenSymbol(null); }} 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === nav.id ? 'bg-[#0052FF] text-white' : 'hover:bg-white/10 opacity-60 hover:opacity-100'}`}
              >
                <nav.icon className="w-4 h-4" />
                {nav.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
             <button onClick={() => setShowVoiceOracle(true)} className="p-2.5 rounded-xl bg-[#0052FF]/10 text-[#0052FF] border border-[#0052FF]/20 hover:bg-[#0052FF]/20 transition-all flex items-center gap-2">
                <Mic className="w-5 h-5" />
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Oracle</span>
             </button>
             <button onClick={handleShareMain} className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2">
                {isShared ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
             </button>
             <button onClick={handleConnect} className="hidden sm:flex px-5 py-2.5 bg-[#0052FF] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0042CC] transition-all shadow-lg">
                {isConnected ? address?.slice(0, 6) + '...' : 'Connect'}
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
              
              {/* Grounded Alpha Section */}
              <div className={`${theme.glass} p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#0052FF] p-2 rounded-xl">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight uppercase text-white">Base Ecosystem <span className="text-[#0052FF]">Alpha</span></h3>
                </div>
                
                {alphaContent ? (
                  <div className="space-y-6">
                    <p className="text-sm text-white/70 leading-relaxed font-medium">
                      {alphaContent.text}
                    </p>
                    {alphaContent.sources.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {alphaContent.sources.map((source, i) => (
                          <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            className="text-[9px] bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#0052FF]/30 transition-all text-white/40 hover:text-[#0052FF]"
                          >
                            {source.title.slice(0, 30)}...
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                  </div>
                )}
              </div>

              <LiveMints onSelectToken={(symbol) => setSelectedTokenSymbol(symbol)} />
            </div>
            <div className="lg:col-span-5">
              <SwapCard onSwapComplete={() => setActiveTab('portfolio')} />
            </div>
          </div>
        )}

        {activeTab === 'launcher' && <VibeLauncher />}
        {activeTab === 'portfolio' && <Portfolio />}
      </main>

      {/* Token Detail Modal (Mock Profile) */}
      {selectedTokenSymbol && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${theme.glass} w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-white/10`}>
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0052FF] flex items-center justify-center font-black text-xl text-white shadow-lg">
                  {selectedTokenSymbol[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-2xl uppercase tracking-tighter text-white">${selectedTokenSymbol}</h3>
                    <span className="text-[8px] bg-[#0052FF]/20 text-[#0052FF] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-[#0052FF]/20">Alpha Access</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-dim)] font-black uppercase tracking-widest flex items-center gap-2 text-white/60">
                    <Activity className="w-3 h-3 text-[#00C2FF]" /> Live Onchain Analytics
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedTokenSymbol(null)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: 'Market Cap', val: '$1.42M', color: 'text-white' },
                   { label: 'Liquidity', val: '$284K', color: 'text-[#00C2FF]' },
                   { label: 'Holders', val: '1,245', color: 'text-white' },
                   { label: '24h Volume', val: '$840K', color: 'text-green-500' }
                 ].map((stat, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                     <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">{stat.label}</div>
                     <div className={`text-sm font-black ${stat.color}`}>{stat.val}</div>
                   </div>
                 ))}
               </div>

               <div className="p-6 rounded-3xl bg-[#0052FF]/5 border border-[#0052FF]/10 space-y-4">
                 <div className="flex items-center gap-2">
                   <Info className="w-4 h-4 text-[#0052FF]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Technical Summary</span>
                 </div>
                 <p className="text-sm text-white/60 leading-relaxed font-medium">
                   BaseTech Oracle indicates high velocity accumulation on the L2. Clanker v4 liquidity is locked for 365 days. The recent sniper auction successfully redistributed ${selectedTokenSymbol} supply among high-conviction addresses. 
                 </p>
               </div>

               <button 
                onClick={() => { setSelectedTokenSymbol(null); setActiveTab('swap'); }}
                className="w-full py-5 bg-[#0052FF] hover:bg-[#0042CC] text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
               >
                 Trade ${selectedTokenSymbol} Instantly
               </button>
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] shadow-2xl z-50">
        <button onClick={() => { setActiveTab('swap'); setSelectedTokenSymbol(null); }} className={`p-4 rounded-2xl transition-all ${activeTab === 'swap' ? 'bg-[#0052FF] text-white' : 'opacity-40 text-white'}`}><ArrowLeftRight /></button>
        <button onClick={() => { setActiveTab('launcher'); setSelectedTokenSymbol(null); }} className={`p-4 rounded-2xl transition-all ${activeTab === 'launcher' ? 'bg-[#0052FF] text-white' : 'opacity-40 text-white'}`}><Wand2 /></button>
        <button onClick={() => { setActiveTab('portfolio'); setSelectedTokenSymbol(null); }} className={`p-4 rounded-2xl transition-all ${activeTab === 'portfolio' ? 'bg-[#0052FF] text-white' : 'opacity-40 text-white'}`}><TrendingUp /></button>
        <button onClick={() => setShowVoiceOracle(true)} className="p-4 rounded-2xl bg-[#0052FF] text-white shadow-lg"><Mic /></button>
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
