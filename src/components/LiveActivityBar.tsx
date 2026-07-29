import React from 'react';
import { Flame, CheckCircle2, RefreshCw } from 'lucide-react';
import { LiveActivityEvent } from '../types';

interface LiveActivityBarProps {
  activities: LiveActivityEvent[];
}

export const LiveActivityBar: React.FC<LiveActivityBarProps> = ({ activities }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="bg-slate-900 text-slate-200 border-y border-slate-800 py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1.5 shrink-0 bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30">
          <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
          <span>Real-Time Okrika Activity</span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center space-x-6 text-[11px]">
          {activities.map((act) => (
            <div key={act.id} className="inline-flex items-center space-x-1.5 shrink-0">
              <span className="text-emerald-400 font-bold">•</span>
              <span className="font-semibold text-white">{act.buyerOrSellerName || 'Buyer'}</span>
              <span className="text-slate-400">
                {act.type === 'sale' ? 'purchased' : act.type === 'reservation' ? 'reserved' : 'listed'}
              </span>
              <span className="font-bold text-amber-300 truncate max-w-[160px]">{act.itemTitle}</span>
              <span className="font-black text-emerald-300">₦{act.itemPrice.toLocaleString()}</span>
              <span className="text-slate-500 text-[10px]">({act.location})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
