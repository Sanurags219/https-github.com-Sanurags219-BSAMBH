import React, { useState } from 'react';
import { Sparkles, Wand2, Loader2, Rocket, Share2, Info } from 'lucide-react';
import { generateTokenConcept, generateTokenImage, TokenConcept } from '../services/geminiService.ts';

export const VibeLauncher: React.FC = () => {
  const [vibe, setVibe] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<TokenConcept | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);

  const handleGenerate = async () => {
    if (!vibe.trim()) return;
    setLoading(true);
    setConcept(null);
    setImageUrl(null);
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
    setTimeout(() => {
      setDeploying(false);
      alert(`${concept?.name} ($${concept?.symbol}) concept saved to BaseTech draft storage! Real deployment requires a connected smart contract wallet.`);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      <div className="glass p-8 rounded-3xl border shadow-xl bg-gradient-to-br from-[#0052FF]/5 to-transparent">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#0052FF] p-2 rounded-xl shadow-lg">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">AI Token Factory</h2>
            <p className="text-xs text-[var(--color-text-dim)] uppercase font-bold tracking-widest">Generate new assets on Base</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-black text-[var(--color-text-dim)] uppercase tracking-widest">
            Define the Vibe
          </label>
          <div className="relative">
            <textarea
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g. A cyberpunk cat that lives on the moon and loves blueberries. It's fast, blue, and built for speed."
              className="w-full h-32 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052FF]/50 transition-all resize-none shadow-inner"
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !vibe.trim()}
              className="absolute bottom-4 right-4 bg-[#0052FF] hover:bg-[#0042CC] disabled:opacity-30 text-white py-2 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span className="text-xs font-black uppercase tracking-widest">Dream it Up</span>
            </button>
          </div>
        </div>
      </div>

      {concept && (
        <div className="glass p-8 rounded-3xl border animate-in slide-in-from-bottom-8 duration-500 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Rocket className="w-32 h-32 text-[#0052FF]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-4xl font-black tracking-tighter text-[var(--color-text)]">
                    {concept.name}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0052FF]/10 rounded-lg mt-3">
                    <span className="text-sm font-black text-[#0052FF] tracking-widest">${concept.symbol}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-[var(--color-surface)] rounded-xl transition-colors">
                    <Share2 className="w-5 h-5 text-[var(--color-text-dim)]" />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] relative">
                <div className="absolute -top-3 left-6 px-2 bg-[var(--color-bg)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">Lore</div>
                <p className="text-sm text-[var(--color-text-dim)] leading-relaxed italic font-medium">
                  "{concept.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]">
                  <div className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-widest mb-1">Standard</div>
                  <div className="text-sm font-bold">ERC-20</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]">
                  <div className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-widest mb-1">Network</div>
                  <div className="text-sm font-bold">Base L2</div>
                </div>
              </div>

              <button 
                onClick={handleDeploy}
                disabled={deploying}
                className="w-full py-5 bg-gradient-to-r from-[#0052FF] to-[#00C2FF] hover:opacity-90 disabled:opacity-50 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {deploying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>Launch on Base</span>
                  </>
                )}
              </button>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white dark:border-[#1a1a1a] shadow-2xl">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={concept.name} 
                    className="w-full h-full object-cover animate-in zoom-in-95 duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface)] flex flex-col items-center justify-center text-[var(--color-text-dim)] p-8 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#0052FF]" />
                    <p className="text-xs font-black uppercase tracking-widest">Generating Visual Identity...</p>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 glass p-3 rounded-xl border flex items-center gap-2">
                  <Info className="w-3 h-3 text-[#0052FF]" />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-70">AI Generated Representation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};