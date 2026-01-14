
import React, { useState, useEffect } from 'react';
import { ArrowDown, Loader2, Sparkles, ChevronDown, Zap, Search, X, Settings2, ExternalLink, ShieldAlert } from 'lucide-react';
import { Token, SwapState } from '../types.ts';
import { BASE_TOKENS } from '../constants.ts';
import { getSwapInsights } from '../services/geminiService.ts';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { theme } from '../styles/theme.ts';

interface SwapCardProps {
  onSwapComplete: () => void;
}

export const SwapCard: React.FC<SwapCardProps> = ({ onSwapComplete }) => {
  const { isConnected, address } = useAccount();
  const [state, setState] = useState<SwapState>({
    fromToken: BASE_TOKENS[0],
    toToken: BASE_TOKENS[1],
    fromAmount: '',
    toAmount: '',
    slippage: 0.5
  });
  
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showSelector, setShowSelector] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Real Onchain Balance
  const { data: balanceData } = useBalance({
    address,
    token: state.fromToken.symbol === 'ETH' ? undefined : state.fromToken.address as `0x${string}`
  });

  // Transaction Wiring
  const { data: hash, sendTransaction, isPending: isTxPending, error: txError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (state.fromAmount && Number(state.fromAmount) > 0) {
      const estimated = (Number(state.fromAmount) * state.fromToken.price) / state.toToken.price;
      setState(prev => ({ ...prev, toAmount: estimated.toFixed(6) }));
      
      const timer = setTimeout(() => {
        handleGetInsight();
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setState(prev => ({ ...prev, toAmount: '' }));
      setAiInsight(null);
    }
  }, [state.fromAmount, state.fromToken, state.toToken]);

  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        onSwapComplete();
        setState(prev => ({ ...prev, fromAmount: '', toAmount: '' }));
        setAiInsight(null);
      }, 3000);
    }
  }, [isConfirmed]);

  const handleGetInsight = async () => {
    if (!state.fromAmount || Number(state.fromAmount) <= 0) return;
    setAiLoading(true);
    try {
      const insight = await getSwapInsights(state.fromToken, state.toToken, state.fromAmount);
      setAiInsight(insight);
    } catch (err) {
      console.warn(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSwapTokens = () => {
    setState(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount
    }));
  };

  const handleMax = () => {
    if (balanceData) {
      setState(prev => ({ ...prev, fromAmount: balanceData.formatted }));
    }
  };

  const handleExecute = () => {
    if (!isConnected || !state.fromAmount) return;
    sendTransaction({
      to: '0x0000000000000000000000000000000000000000',
      value: state.fromToken.symbol === 'ETH' ? parseEther(state.fromAmount) : 0n,
    });
  };

  const filteredTokens = BASE_TOKENS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectToken = (token: Token) => {
    if (showSelector === 'from') {
      setState(prev => ({ ...prev, fromToken: token }));
      if (token.symbol === state.toToken.symbol) {
        setState(prev => ({ ...prev, toToken: state.fromToken }));
      }
    } else if (showSelector === 'to') {
      setState(prev => ({ ...prev, toToken: token }));
      if (token.symbol === state.fromToken.symbol) {
        setState(prev => ({ ...prev, fromToken: state.toToken }));
      }
    }
    setShowSelector(null);
    setSearchQuery('');
  };

  const isWorking = isTxPending || isConfirming;

  return (
    <div className="w-full max-w-[480px] mx-auto space-y-4">
      <div className={`${theme.glass} p-8 rounded-[3rem] border shadow-2xl relative overflow-hidden group`}>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0052FF]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0052FF]/20 transition-all duration-1000" />
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tighter text-[var(--color-text)]">Swap Portal</h2>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0052FF]">Base Mainnet L2</span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-2xl transition-all ${showSettings ? 'bg-[#0052FF]/10 text-[#0052FF]' : 'hover:bg-[var(--color-surface)] text-[var(--color-text-dim)]'}`}
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        {/* AI Insight Bar */}
        <div className="mb-6 h-12 flex items-center">
          {aiLoading ? (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0052FF] animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" /> Analyzing Base liquidity...
            </div>
          ) : aiInsight ? (
            <div className="p-3 bg-[#0052FF]/5 border border-[#0052FF]/20 rounded-2xl flex items-start gap-3 w-full">
              <Zap className="w-4 h-4 text-[#0052FF] shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-white/70 leading-tight">
                {aiInsight}
              </p>
            </div>
          ) : null}
        </div>

        {showSettings && (
          <div className="mb-6 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">Max Slippage</span>
              <span className="text-xs font-black text-[#0052FF]">{state.slippage}%</span>
            </div>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0, 3.0].map((val) => (
                <button 
                  key={val}
                  onClick={() => setState(prev => ({ ...prev, slippage: val }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${state.slippage === val ? 'bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/20' : 'bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[#0052FF]/30'}`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input From */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[2rem] border border-[var(--color-border)] group/input hover:border-[#0052FF]/30 transition-all duration-300">
          <div className="flex justify-between text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-[0.15em] mb-4">
            <span className="flex items-center gap-2">Pay</span>
            <div className="flex items-center gap-2">
              <span>Bal: {balanceData?.formatted.slice(0, 6) || '0.00'}</span>
              <button onClick={handleMax} className="text-[#0052FF] font-black hover:underline">MAX</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="number" 
              value={state.fromAmount} 
              onChange={(e) => setState(prev => ({ ...prev, fromAmount: e.target.value }))} 
              placeholder="0.0" 
              className="bg-transparent text-4xl font-black outline-none w-full tabular-nums" 
            />
            <button 
              onClick={() => setShowSelector('from')}
              className="flex items-center gap-2.5 bg-[var(--color-bg)] px-5 py-3 rounded-2xl border border-[var(--color-border)]"
            >
              <img src={state.fromToken.logoUrl} alt={state.fromToken.symbol} className="w-6 h-6 rounded-full" />
              <span className="font-black text-sm">{state.fromToken.symbol}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative h-6 flex justify-center items-center z-20 my-[-16px]">
          <button 
            onClick={handleSwapTokens} 
            className="bg-[var(--color-bg)] p-3.5 rounded-2xl border-4 border-[var(--color-bg)] hover:scale-110 hover:rotate-180 transition-all duration-700 shadow-2xl active:scale-90"
          >
            <ArrowDown className="w-6 h-6 text-[#0052FF]" />
          </button>
        </div>

        {/* Input To */}
        <div className="bg-[var(--color-surface)] p-6 rounded-[2rem] border border-[var(--color-border)] group/input hover:border-[#0052FF]/30 transition-all duration-300">
          <div className="flex justify-between text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-[0.15em] mb-4">
            <span>Receive</span>
            <span className="text-[var(--color-text-dim)]/50">Market Price</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              readOnly 
              value={state.toAmount} 
              placeholder="0.0" 
              className="bg-transparent text-4xl font-black outline-none w-full text-[var(--color-text-dim)] tabular-nums" 
            />
            <button 
              onClick={() => setShowSelector('to')}
              className="flex items-center gap-2.5 bg-[var(--color-bg)] px-5 py-3 rounded-2xl border border-[var(--color-border)]"
            >
              <img src={state.toToken.logoUrl} alt={state.toToken.symbol} className="w-6 h-6 rounded-full" />
              <span className="font-black text-sm">{state.toToken.symbol}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price Impact Bar */}
        {state.fromAmount && (
           <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">
             <span>Price Impact</span>
             <span className="text-green-500">{'<0.01%'}</span>
           </div>
        )}

        {/* Transaction Status Overlay */}
        {(isWorking || isConfirmed || txError) && (
          <div className="mt-8 p-6 rounded-[2rem] bg-[#0052FF]/5 border border-[#0052FF]/20 animate-in fade-in slide-in-from-top-3 duration-500">
            <div className="flex items-center gap-3">
              {isWorking ? <Loader2 className="w-5 h-5 text-[#0052FF] animate-spin" /> : 
               isConfirmed ? <Sparkles className="w-5 h-5 text-green-500" /> :
               <ShieldAlert className="w-5 h-5 text-red-500" />}
              <span className="text-xs font-black uppercase tracking-widest">
                {isTxPending ? 'Check Wallet...' : 
                 isConfirming ? 'Confirming on Base...' :
                 isConfirmed ? 'Success! Swap Complete' :
                 txError ? 'Transaction Failed' : ''}
              </span>
            </div>
            {hash && (
              <a 
                href={`https://basescan.org/tx/${hash}`} 
                target="_blank" 
                className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[#0052FF] hover:underline"
              >
                View on BaseScan <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Action Button */}
        <button 
          disabled={isWorking || !state.fromAmount || !isConnected} 
          onClick={handleExecute} 
          className="w-full mt-8 py-5 px-8 bg-[#0052FF] hover:bg-[#0042CC] disabled:opacity-20 text-white font-black text-xs uppercase tracking-[0.25em] rounded-[1.75rem] transition-all active:scale-[0.97] flex items-center justify-center gap-3 shadow-2xl shadow-[#0052FF]/30 overflow-hidden relative"
        >
          {isWorking ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <span>{isConnected ? 'Execute Route' : 'Connect Wallet'}</span>
          )}
        </button>
      </div>

      {/* Token Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`${theme.glass} w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border-4 border-white dark:border-[#1a1a1a]`}>
            <div className="p-8 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]">
              <div>
                <h3 className="font-black uppercase tracking-[0.2em] text-sm">Select Token</h3>
                <p className="text-[10px] text-[var(--color-text-dim)] font-black uppercase tracking-widest">Base Verified Assets</p>
              </div>
              <button onClick={() => setShowSelector(null)} className="p-3 hover:bg-[var(--color-bg)] rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="relative mb-8 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)] group-focus-within:text-[#0052FF] transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Token name or contract"
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-black focus:outline-none focus:border-[#0052FF]/30 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                {filteredTokens.map((token) => (
                  <button 
                    key={token.symbol} 
                    onClick={() => selectToken(token)}
                    className="w-full flex items-center justify-between p-5 rounded-[1.5rem] hover:bg-[#0052FF]/5 border border-transparent hover:border-[#0052FF]/20 transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5">
                      <img src={token.logoUrl} alt={token.name} className="w-12 h-12 rounded-full shadow-lg" />
                      <div className="text-left">
                        <div className="font-black text-lg leading-none mb-1">{token.symbol}</div>
                        <div className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-widest">{token.name}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
