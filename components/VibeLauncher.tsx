import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Wand2, Loader2, Rocket, Share2, Info, ShieldCheck, 
  Lock, ShoppingCart, Users, ChevronRight, Activity, Zap, Trash2, AlertCircle
} from 'lucide-react';
import { generateTokenConcept, generateTokenImage, TokenConcept } from '../services/geminiService.ts';
import { theme } from '../styles/theme.ts';

interface ClankerConfig {
  vaultDays: number;
  devBuyEth: string;
  airdropCount: number;
  isBurnable: boolean;
}

export const VibeLauncher: React.FC = () => {
  const [vibe, setVibe] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<TokenConcept | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  
  // Clanker V4.0.0 specific configs
  const [config, setConfig] = useState<ClankerConfig>({
    vaultDays: 7, // Min 7 days
    devBuyEth: '0',
    airdropCount: 0,
    isBurnable: true
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!vibe.trim()) return;
    setLoading(true);
    setConcept(null);
    setImageUrl(null);
    setDeployStep(0);
    try {
      const newConcept = await generateTokenConcept(vibe);
      setConcept(newConcept);
      const img = await generateTokenImage(newConcept.imagePrompt);
      setImageUrl(img);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = () => {
    setDeploying(true);
    setDeployStep(1);
    
    // Simulate Clanker V4 Deployment Sequence
    const steps = [
      "Initializing Clanker V4 Factory...",
      "Configuring Extensions (Vault & Dev Buy)...",
      "Minting 100B Fixed Supply...",
      "Seeding Uniswap V4 Liquidity...",
      "Entering Sniper Auction (22s delay)...",
      "Deploy Complete!"
    ];

    let current = 1;
    const interval = setInterval(() => {
      current++;
      setDeployStep(current);
      if (current === steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDeploying(false);
          alert(`Successfully launched ${concept?.name} ($${concept?.symbol})! Total Supply: 100B. Initial Liquidity locked via Clanker v4.`);
        }, 1000);
      }
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Token <span className="text-[#0052FF]">Deployments</span></h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded">Live</span>
            <p className="text-xs text-[var(--color-text-dim)] font-bold uppercase tracking-widest">Base Mainnet • Clanker V4.0.0</p>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="text-right">
            <div className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-widest">Fixed Supply</div>
            <div className="text-sm font-black">100,000,000,000</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-widest">Type</div>
            <div className="text-sm font-black text-[#00C2FF]">Clanker ERC-20</div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Creator Input */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`${theme.glass} p-8 rounded-[2.5rem] border relative overflow-hidden`}>
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <Zap className="w-24 h-24 text-[#0052FF]" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#0052FF] p-2 rounded-xl shadow-lg">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-black tracking-tight">AI Concept Generator</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-[0.2em] flex items-center gap-2">
                  Dream the Vibe <Sparkles className="w-3 h-3 text-[#0052FF]" />
                </label>
                <div className="relative group">
                  <textarea
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="A hyper-deflationary token for space explorers who love blue cats..."
                    className="w-full h-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 text-sm font-medium focus:outline-none focus:border-[#0052FF] transition-all resize-none shadow-inner"
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                     <button
                        onClick={handleGenerate}
                        disabled={loading || !vibe.trim()}
                        className="bg-[#0052FF] hover:bg-[#0042CC] disabled:opacity-30 text-white py-3 px-8 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {loading ? 'Manifesting...' : 'Dream it Up'}
                      </button>
                  </div>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)] hover:text-[#0052FF] transition-colors"
              >
                {showAdvanced ? 'Hide' : 'Show'} Advanced Launch Extensions
                <ChevronRight className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-dim)] flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Vault Lockup
                      </label>
                      <span className="text-xs font-black text-[#0052FF]">{config.vaultDays} Days</span>
                    </div>
                    <input 
                      type="range" min="7" max="365" step="1"
                      value={config.vaultDays}
                      onChange={(e) => setConfig({...config, vaultDays: parseInt(e.target.value)})}
                      className="w-full h-1 bg-[#0052FF]/20 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
                    />
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-dim)] flex items-center gap-2">
                        <ShoppingCart className="w-3 h-3" /> Dev Buy (ETH)
                      </label>
                    </div>
                    <input 
                      type="number" step="0.01" min="0"
                      value={config.devBuyEth}
                      onChange={(e) => setConfig({...config, devBuyEth: e.target.value})}
                      placeholder="0.0"
                      className="w-full bg-transparent text-sm font-black outline-none border-b border-[var(--color-border)] focus:border-[#0052FF] pb-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Deployment Warnings/Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Fixed Supply</span>
              <span className="text-xs font-black">100B Tokens</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Mintable</span>
              <span className="text-xs font-black text-red-500">Disabled</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-[var(--color-text-dim)] tracking-widest">Governance</span>
              <span className="text-xs font-black text-[#00C2FF]">Contract Renounced</span>
            </div>
          </div>
        </div>

        {/* Right: Result & Preview */}
        <div className="lg:col-span-5 space-y-6">
          {concept ? (
            <div className={`${theme.glass} rounded-[3rem] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-500 shadow-2xl`}>
              <div className="relative aspect-square group">
                {imageUrl ? (
                  <img src={imageUrl} alt={concept.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface)] flex flex-col items-center justify-center p-8 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#0052FF]" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Rendering Visual DNA...</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-black tracking-tighter text-white">{concept.name}</h3>
                  <p className="text-[#0052FF] font-black tracking-[0.2em] text-xs uppercase mt-1">${concept.symbol}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">
                    <span>Protocol Spec</span>
                    <span className="text-[#0052FF]">Verified</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-dim)] font-medium leading-relaxed italic">
                    "{concept.description}"
                  </p>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-white/5">
                  <div className="flex-1">
                    <div className="text-[8px] font-black text-[var(--color-text-dim)] uppercase tracking-widest">Status</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      <span className="text-xs font-black uppercase">Pending Deploy</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-white/5" />
                  <div className="flex-1 text-right">
                    <div className="text-[8px] font-black text-[var(--color-text-dim)] uppercase tracking-widest">Network</div>
                    <div className="text-xs font-black uppercase text-[#0052FF]">Base L2</div>
                  </div>
                </div>

                {deploying ? (
                  <div className="space-y-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#0052FF]">Deployment in Progress</span>
                      <span className="text-[10px] font-black">{Math.round((deployStep / 6) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#0052FF] to-[#00C2FF] transition-all duration-1000"
                        style={{ width: `${(deployStep / 6) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-center animate-pulse text-[var(--color-text-dim)]">
                      {["Booting...", "Initializing Clanker Factory...", "Setting Extensions...", "Fixed Supply Locked...", "Seeding LP...", "Auction Active...", "Success!"][deployStep]}
                    </p>
                  </div>
                ) : (
                  <button 
                    onClick={handleDeploy}
                    className="w-full py-5 bg-[#0052FF] hover:bg-[#0042CC] text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-[#0052FF]/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <Rocket className="w-5 h-5" />
                    Deploy Clanker V4
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center text-[var(--color-text-dim)]">
              <div className="bg-white/5 p-6 rounded-[2.5rem] mb-6">
                <AlertCircle className="w-12 h-12 opacity-20" />
              </div>
              <h3 className="font-black text-lg uppercase tracking-widest mb-2">Awaiting Vision</h3>
              <p className="text-xs font-medium leading-relaxed max-w-[240px]">
                Input a vibe on the left to materialize a new asset on Base via Clanker protocol.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Protocol Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Burnable Supply</h4>
          </div>
          <p className="text-[10px] text-[var(--color-text-dim)] font-medium leading-relaxed">
            Tokens are non-mintable post-deployment. The burn function is available on the contract to permanently reduce supply.
          </p>
        </div>
        <div className={`${theme.glass} p-6 rounded-[2rem] space-y-3 border-blue-500/30`}>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-[#0052FF]" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Auction Module</h4>
          </div>
          <p className="text-[10px] text-[var(--color-text-dim)] font-medium leading-relaxed">
            Deployment includes a 5-round Sniper Auction (ClankerSniperAuctionV0) to capture MEV value for the creator.
          </p>
        </div>
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#00C2FF]" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Airdrop Extension</h4>
          </div>
          <p className="text-[10px] text-[var(--color-text-dim)] font-medium leading-relaxed">
            Up to 90% of supply can be allocated to extensions like Vault locks and verified airdrop claims.
          </p>
        </div>
      </div>
    </div>
  );
};