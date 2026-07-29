import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, CheckCircle2, DollarSign, Shirt } from 'lucide-react';

interface AiAssistantModalProps {
  onClose: () => void;
  initialPrompt?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  onClose,
  initialPrompt = ''
}) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: '🇳🇬 Welcome to Okrika AI Concierge! Ask me anything about thrift valuations in Naira, condition grades, Y2K style pairings, or how to spot authentic vintage.'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (customText?: string) => {
    const query = customText || inputPrompt;
    if (!query.trim()) return;

    const userMsg = query;
    setInputPrompt('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/pricing-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: userMsg, brand: 'Vintage', category: 'Clothing' })
      });

      const data = await res.json();

      let reply = '';
      if (data.suggestedPriceNaira) {
        reply = `💡 Valuation Estimate: ₦${data.suggestedPriceNaira.toLocaleString()} (Range: ₦${data.priceRangeMin?.toLocaleString()} - ₦${data.priceRangeMax?.toLocaleString()})\n\nMarket Insight: ${data.marketInsight || 'High demand among Nigerian thrifters.'}\n\nRecommended Title: ${data.optimizedTitle}`;
      } else {
        reply = "Grade A thrift items in Lagos and Abuja generally hold 60-80% value if zip and fabric are 100% intact. Paystack Escrow ensures safe transactions!";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error contacting AI thrift advisor. Try asking about denim or sneakers.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] sm:max-h-[85vh] flex flex-col my-auto border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300" />
            <span className="text-xs sm:text-sm font-bold">Okrika AI Style & Valuation Concierge</span>
          </div>

          <button
            id="close-ai-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Analyzing Nigerian thrift market data...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <button
            onClick={() => handleSend('Estimate price for Vintage Nike Dunk Lows in Lagos')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
          >
            👟 Nike Dunk Valuation
          </button>
          <button
            onClick={() => handleSend('What should I wear to a Y2K thrift themed party?')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
          >
            ✨ Y2K Outfit Advice
          </button>
          <button
            onClick={() => handleSend('How to spot Grade A Okrika from Grade B bales')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 whitespace-nowrap cursor-pointer"
          >
            🔍 Okrika Quality Guide
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            id="ai-prompt-input"
            type="text"
            placeholder="Ask AI about thrift pricing, condition, or outfit styling..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            id="ai-send-btn"
            onClick={() => handleSend()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
