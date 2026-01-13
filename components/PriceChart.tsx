import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_CHART_DATA } from '../constants.ts';

export const PriceChart: React.FC = () => {
  return (
    <div className="glass p-6 rounded-3xl border h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[var(--color-text-dim)] text-xs font-black uppercase tracking-widest">ETH/USDC</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--color-text)]">$2,450.25</span>
            <span className="text-green-500 text-sm font-black">+2.45%</span>
          </div>
        </div>
        <div className="flex gap-2">
          {['1D', '1W', '1M'].map((period) => (
            <button 
              key={period}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-colors ${
                period === '1D' ? 'bg-[#0052FF] text-white' : 'hover:bg-[var(--color-surface)] text-[var(--color-text-dim)]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_CHART_DATA}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0052FF" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-text-dim)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="var(--color-text-dim)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              domain={['dataMin - 50', 'dataMax + 50']}
              hide
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-bg)', 
                border: '1px solid var(--color-glass-border)',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#0052FF' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#0052FF" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};