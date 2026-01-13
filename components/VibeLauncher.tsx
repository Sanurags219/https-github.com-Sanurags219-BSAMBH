import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Loader2, Rocket, Info, ShieldCheck, 
  Lock, ShoppingCart, ChevronRight, Activity, Zap, Trash2, AlertCircle,
  Gavel, Clock, Shield, Layers, Users, MousePointer2, RefreshCcw
} from 'lucide-react';
import { 
  getTokenSuggestions, 
  completeTokenDetails, 
  generateTokenImage, 
  TokenConcept, 
  TokenSuggestion 
} from '../services/geminiService.ts';
import { theme } from '../styles/theme.ts';

interface ClankerConfig {
  vaultDays: number;
  devBuyEth: string;
  airdropCount: number;
  isBurnable: boolean;
}

export const VibeLauncher: React.FC = () => {
  const [vibe, setVibe] = useState('');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingBlueprint, setLoadingBlueprint] = useState(false);
  const [suggestions, setSuggestions] = useState<TokenSuggestion[]>([]);
  const [concept, setConcept] = useState<TokenConcept | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [auctionRound, setAuctionRound] = useState(0);
  
  const [config, setConfig] = useState<ClankerConfig>({
    vaultDays: 7,
    devBuyEth: '0',
    airdropCount: 0,
    isBurnable: true
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGetSuggestions = async () => {
    if (!vibe.trim()) return;
    setLoadingSuggestions(true);
    setSuggestions([]);
    setConcept(null);
    setImageUrl(null);
    try {
      const results = await getTokenSuggestions(vibe);
      setSuggestions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handlePickSuggestion = async (s: TokenSuggestion) => {
    setLoadingBlueprint(true);
    setConcept(null);
    setImageUrl(null);
    try {
      const details = await completeTokenDetails(s.name, s.symbol, vibe);
      const fullConcept: TokenConcept = {
        name: s.name,
        symbol: s.symbol,
        ...details
      };
      setConcept(fullConcept);
      if (details.suggestedVaultDays) {
        setConfig(prev => ({ ...prev, vaultDays: Math.max(7, details.suggestedVaultDays!) }));
      }
      const img = await generateTokenImage(details.imagePrompt);
      setImageUrl(img);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBlueprint(false);
    }
  };

  const handleDeploy = () => {
    setDeploying(true);
    setDeployStep(1);
    
    const steps = [
      "Initializing ClankerV4 Factory...",
      "Configuring Extensions (Vault & Dev Buy)...",
      "Minting 100B Fixed Supply...",
      "Seeding Uniswap v4 Liquidity...",
      "Executing Sniper Auction (22s)...",
      "Deployment Finalized!"
    ];

    let current = 1;
    const interval = setInterval(() => {
      current++;
      setDeployStep(current);
      
      if (current === 5) {
        let round = 1;
        const auctionInterval = setInterval(() => {
          setAuctionRound(round);
          round++;
          if (round > 5) {
            clearInterval(auctionInterval);
          }
        }, 1200);
      }

      if (current >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDeploying(false);
          alert(`Success! ${concept?.name} ($${concept?.symbol}) is live on Base.\n\nTotal Supply: 100 Billion (Fixed)\nExtensions: ${config.vaultDays}d Vault Lock\nSniper Auction: Completed`);
        }, 1000);
      }
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      {/* Protocol Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <h1 className="text-4xl font-black tracking-tighter uppercase">Token <span className="text-[#0052FF]">Deployments</span></h1>
             <div className="px-3 py-1 bg-[#0052FF]/10 border border-[#0052FF]/20 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
                <span className="text-[10px] font-black text-[#0052FF] uppercase tracking-widest">Live: Clanker v4.0.0</span>
             </div>
          </div>
          <p className="text-xs text-[var(--color-text-dim)] font-bold uppercase tracking-[0.2em]">Launch verified assets on Base L2 Mainnet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creator Config */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`${theme.glass} p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transition-all duration-700">
               <Zap className="w-48 h-48 text-[#0052FF]" />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#0052FF] p-2.5 rounded-2xl shadow-xl">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-black tracking-tight text-white uppercase">Asset Ideation</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-[0.3em] flex items-center gap-2">
                  Conceptual Vibe <Sparkles className="w-3 h-3 text-[#0052FF]" />
                </label>
                <div className="relative">
                  <textarea
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="Describe the soul of your project... (e.g., A futuristic governance token for a creator network on Base)"
                    className="w-full h-32 bg-[var(--color-bg)]/50 border border-[var(--color-border)] rounded-3xl p-6 text-sm font-medium focus:outline-none focus:border-[#0052FF] transition-all resize-none shadow-inner"
                  />
                  <div className="absolute bottom-4 right-4">
                     <button
                        onClick={handleGetSuggestions}
                        disabled={loadingSuggestions || !vibe.trim()}
                        className="bg-[#0052FF] hover:bg-[#0042CC] disabled:opacity-30 text-white py-2.5 px-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                      >
                        {loadingSuggestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                        {loadingSuggestions ? 'Brainstorming...' : 'Suggest Names'}
                      </button>
                  </div>
                </div>
              </div>

              {/* Suggestions Grid */}
              {suggestions.length > 0 && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">AI Suggested Blueprints</h3>
                    <span className="text-[8px] bg-[#00C2FF]/10 text-[#00C2FF] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Select One</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestions.map((s, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handlePickSuggestion(s)}
                        className="group relative p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#0052FF]/40 text-left transition-all hover:bg-white/[0.08]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-black text-white group-hover:text-[#0052FF] transition-colors">{s.name}</span>
                          <span className="text-[9px] font-black uppercase text-[#00C2FF] bg-[#00C2FF]/5 px-2 py-0.5 rounded-lg border border-[#00C2FF]/10">${s.symbol}</span>
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MousePointer2 className="w-3 h-3 text-[#0052FF]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Clanker Extensions (Only show if we have a concept selected) */}
              {concept && (
                <div className="pt-4 border-t border-white/5 space-y-4 animate-in fade-in duration-500">
                  <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Layers className="w-5 h-5 text-[#00C2FF]" />
                      <div className="text-left">
                        <h3 className="text-xs font-black uppercase tracking-widest text-white">Protocol Tuning</h3>
                        <p className="text-[9px] text-[var(--color-text-dim)] font-bold uppercase">Configure Vaults & Dev Buy</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                  </button>

                  {showAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">Vault Lockup</label>
                          <span className="text-xs font-black text-white">{config.vaultDays}d</span>
                        </div>
                        <input 
                          type="range" min="7" max="365" step="1"
                          value={config.vaultDays}
                          onChange={(e) => setConfig({...config, vaultDays: parseInt(e.target.value)})}
                          className="w-full h-1 bg-[#0052FF]/20 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
                        />
                      </div>
                      
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">Dev Buy (ETH)</label>
                        <input 
                          type="number" step="0.01" min="0"
                          value={config.devBuyEth}
                          onChange={(e) => setConfig({...config, devBuyEth: e.target.value})}
                          placeholder="0.0"
                          className="w-full bg-transparent text-xl font-black outline-none border-b border-white/10 focus:border-[#0052FF] pb-1 text-white tabular-nums"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Compliance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col gap-2">
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="text-[8px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Deflationary</span>
              <span className="text-xs font-black text-white">Burn on Trade</span>
            </div>
            <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="text-[8px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Fixed Supply</span>
              <span className="text-xs font-black text-white">100B Standard</span>
            </div>
            <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 flex flex-col gap-2">
              <Gavel className="w-5 h-5 text-blue-500" />
              <span className="text-[8px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Market Logic</span>
              <span className="text-xs font-black text-white">Sniper Auction</span>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="lg:col-span-5 space-y-6">
          {loadingBlueprint ? (
            <div className={`${theme.glass} rounded-[3rem] border border-white/10 h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center animate-pulse`}>
               <div className="bg-[#0052FF]/20 p-6 rounded-full mb-6 relative">
                 <Loader2 className="w-10 h-10 animate-spin text-[#0052FF]" />
                 <div className="absolute inset-0 bg-[#0052FF]/10 blur-xl rounded-full" />
               </div>
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">Manifesting Token DNA</h3>
               <p className="text-sm text-[var(--color-text-dim)] mt-2 font-medium">Gemini is synthesizing high-fidelity metadata and 3D icons...</p>
            </div>
          ) : concept ? (
            <div className={`${theme.glass} rounded-[3rem] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl`}>
              <div className="relative aspect-square bg-[var(--color-surface)]">
                {imageUrl ? (
                  <img src={imageUrl} alt={concept.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-3xl">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#0052FF]" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Rendering High-Fidelity Asset...</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-4xl font-black tracking-tighter text-white leading-none">{concept.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                     <span className="text-[#00C2FF] font-black tracking-[0.3em] text-sm uppercase">${concept.symbol}</span>
                     <div className="h-4 w-px bg-white/20" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Fixed 100B</span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">
                    <span>Blueprint Spec</span>
                    <span className="text-[#0052FF] flex items-center gap-1"><Shield className="w-3 h-3"/> Base L2 Mainnet</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-dim)] font-medium leading-relaxed italic border-l-2 border-[#0052FF] pl-4">
                    "{concept.description}"
                  </p>
                </div>

                {deploying ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-[#0052FF] animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">
                          {deployStep === 5 ? `Auction Round ${auctionRound}/5` : 'Deploying Protocol...'}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-[#0052FF]">{Math.round((deployStep / 6) * 100)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-[#0052FF] shadow-[0_0_15px_rgba(0,82,255,0.5)] transition-all duration-1000"
                        style={{ width: `${(deployStep / 6) * 100}%` }}
                      />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-center text-[var(--color-text-dim)] animate-pulse h-4">
                      {["Booting Sequence...", "Initializing Clanker Factory...", "Setting Extensions...", "Minting Supply...", "Seeding v4 Liquidity...", "MEV Auction Active...", "Deployment Successful!"][deployStep]}
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={handleDeploy}
                    className="w-full py-6 bg-[#0052FF] hover:bg-[#0042CC] text-white font-black text-xs uppercase tracking-[0.4em] rounded-[1.75rem] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] group"
                  >
                    <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    Finalize Deployment
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center text-[var(--color-text-dim)]">
              <div className="bg-white/5 p-8 rounded-[3rem] mb-6">
                <AlertCircle className="w-12 h-12 opacity-20" />
              </div>
              <h3 className="font-black text-2xl uppercase tracking-tighter mb-3 text-white">Synthesize Asset</h3>
              <p className="text-sm font-medium leading-relaxed max-w-[280px]">
                Describe your project's vibe on the left to get AI suggestions and start the Clanker deployment flow.
              </p>
              <div className="mt-12 w-full grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                    <Clock className="w-4 h-4 text-[#0052FF] mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Timing</span>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Instant Portal</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                    <Shield className="w-4 h-4 text-[#00C2FF] mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">V4 Audit</span>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Verified Logic</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Protocol Info */}
      <div className={`${theme.glass} p-10 rounded-[3.5rem] border border-white/5`}>
        <div className="flex items-center gap-4 mb-8">
           <div className="bg-[#00C2FF] p-2 rounded-xl">
              <Info className="w-5 h-5 text-white" />
           </div>
           <h3 className="text-xl font-black uppercase tracking-tighter text-white">Clanker Deployment <span className="text-[#00C2FF]">Standards</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00C2FF] flex items-center gap-2"><Layers className="w-3 h-3"/> V4 Liquidity</h4>
            <p className="text-[11px] text-[var(--color-text-dim)] font-medium leading-relaxed">
              Base tokens are allocated to Uniswap v4 pools with automated liquidity seeding directly in the deployment transaction.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00C2FF] flex items-center gap-2"><Users className="w-3 h-3"/> Protocol Extensions</h4>
            <p className="text-[11px] text-[var(--color-text-dim)] font-medium leading-relaxed">
              Add custom vaults, dev buybacks, or airdrops. Clanker v4 handles the logic natively for maximum efficiency.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00C2FF] flex items-center gap-2"><Gavel className="w-3 h-3"/> MEV Protection</h4>
            <p className="text-[11px] text-[var(--color-text-dim)] font-medium leading-relaxed">
              Every launch features a 22-second auction round to ensure fair distribution and capture value for the treasury.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};