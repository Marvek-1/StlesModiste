import React from 'react';
import { 
  Scissors, 
  Shirt, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Layers, 
  Award,
  Sparkle
} from 'lucide-react';
import { BrandSection } from '../types';

interface HeroBannerProps {
  onExploreClick: () => void;
  onOpenSellerDashboard: () => void;
  onOpenAiAssistant: () => void;
  selectedSection: BrandSection;
  setSelectedSection: (s: BrandSection) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onOpenSellerDashboard,
  onOpenAiAssistant,
  selectedSection,
  setSelectedSection
}) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-3 sm:my-5">
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
        
        {/* Bento Box 1: Primary Brand Showcase Hero (Col span 7) */}
        <div className="lg:col-span-7 bg-stone-900 text-stone-100 rounded-3xl p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between border border-stone-800 shadow-lg">
          {/* Subtle Background Pattern Accent */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/50 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-emerald-200 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Official Fashion Brand Hub • Stylemodiste</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              One Fashion Brand. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                Two Dedicated Sections.
              </span>
            </h1>

            <p className="text-stone-300 text-xs sm:text-base leading-relaxed max-w-xl">
              Navigate seamlessly between <strong className="text-amber-300">Section 1: Quality Fabrics</strong> (Crepe, Silk, Chiffon, Chantilly Lace, Wrappers) and <strong className="text-emerald-300">Section 2: Thrift Wears</strong> (Grade A vintage tops, dresses, denim, kicks).
            </p>

            {/* Quick Dual Section Toggles inside Hero */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                id="hero-toggle-fabrics"
                onClick={() => {
                  setSelectedSection('fabrics');
                  onExploreClick();
                }}
                className={`px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer shadow-sm ${
                  selectedSection === 'fabrics'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                }`}
              >
                <Scissors className="w-4 h-4 text-amber-300" />
                <span>Shop Fabrics Section</span>
              </button>

              <button
                id="hero-toggle-thrift"
                onClick={() => {
                  setSelectedSection('thrift');
                  onExploreClick();
                }}
                className={`px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-2xl text-xs font-black transition-all flex items-center space-x-2 cursor-pointer shadow-sm ${
                  selectedSection === 'thrift'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                }`}
              >
                <Shirt className="w-4 h-4 text-amber-300" />
                <span>Shop Thrift Section</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs text-stone-300">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Paystack Escrow Protection</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>GIGL & Kwik Express Courier</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-teal-400 shrink-0" />
              <span>100% Quality Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Section 1 Card Tab - Quality Fabrics (Col span 5) */}
        <div 
          onClick={() => {
            setSelectedSection('fabrics');
            onExploreClick();
          }}
          className={`lg:col-span-5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all cursor-pointer shadow-md ${
            selectedSection === 'fabrics'
              ? 'bg-emerald-950 text-white border-2 border-emerald-400 ring-4 ring-emerald-500/30'
              : 'bg-emerald-900 text-white border border-emerald-800 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              Card Tab • Section 1: Fabrics
            </span>
            <div className="flex items-center gap-1.5">
              {selectedSection === 'fabrics' && (
                <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active Card
                </span>
              )}
              <Scissors className="w-5 h-5 text-amber-300" />
            </div>
          </div>

          <div className="my-4 space-y-2">
            <h3 className="text-xl font-bold text-white">Quality & Affordable Fabrics</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Explore double-stretch Crepe, pure Mulberry Silk, breathable Chiffon, French Chantilly Lace, and embroidered Velvet Wrappers.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Crepe', 'Mulberry Silk', 'Chiffon', 'Chantilly', 'Wrappers'].map(f => (
                <span key={f} className="text-[10px] bg-emerald-800/80 border border-emerald-700 text-emerald-200 px-2 py-0.5 rounded-lg">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
          >
            <span>{selectedSection === 'fabrics' ? 'Viewing Fabrics Section ✓' : 'Open Fabrics Section Card'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Box 3: Section 2 Card Tab - Thrift Wears (Col span 4) */}
        <div 
          onClick={() => {
            setSelectedSection('thrift');
            onExploreClick();
          }}
          className={`lg:col-span-4 rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between shadow-2xs ${
            selectedSection === 'thrift'
              ? 'bg-slate-900 text-white border-2 border-amber-400 ring-4 ring-amber-500/30'
              : 'bg-stone-100 text-stone-900 border-stone-200 hover:border-amber-400'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                selectedSection === 'thrift' ? 'bg-amber-400 text-slate-950' : 'bg-stone-900 text-amber-300'
              }`}>
                Card Tab • Section 2: Thrift
              </span>
              <div className="flex items-center gap-1">
                {selectedSection === 'thrift' && (
                  <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Card
                  </span>
                )}
                <Shirt className={`w-5 h-5 ${selectedSection === 'thrift' ? 'text-amber-300' : 'text-emerald-800'}`} />
              </div>
            </div>

            <h3 className={`text-lg font-black mt-3 ${selectedSection === 'thrift' ? 'text-white' : 'text-stone-900'}`}>
              Grade A Thrift Wears
            </h3>
            <p className={`text-xs mt-1 leading-relaxed ${selectedSection === 'thrift' ? 'text-slate-300' : 'text-stone-600'}`}>
              Crisp pre-loved dresses, Y2K tops, vintage denim jackets, designer bags, and sanitized kicks.
            </p>
          </div>

          <div className={`mt-4 pt-3 border-t flex items-center justify-between ${selectedSection === 'thrift' ? 'border-slate-800' : 'border-stone-200'}`}>
            <span className={`text-[11px] font-bold ${selectedSection === 'thrift' ? 'text-amber-300' : 'text-emerald-800'}`}>
              Stylemodiste Pre-Loved Vault
            </span>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSection === 'thrift' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-stone-900 text-white'
              }`}
            >
              {selectedSection === 'thrift' ? 'Active ✓' : 'Open Thrift Card'}
            </button>
          </div>
        </div>

        {/* Bento Box 4: Logistics & Delivery Status (Col span 4) */}
        <div className="lg:col-span-4 bg-stone-900 text-stone-100 rounded-3xl p-5 border border-stone-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <Truck className="w-4 h-4 text-amber-400" /> Express Waybill Logistics
              </span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full font-bold">
                In Transit
              </span>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs font-bold text-stone-300">Waybill #GIGL-LAG-849201</p>
              <p className="text-sm font-black text-white">Lagos Hub ➔ Abuja Doorstep Dispatch</p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span>GIGL & Kwik Courier Network</span>
            <span className="text-emerald-400 font-bold">Estimated 24 Hours</span>
          </div>
        </div>

        {/* Bento Box 5: Verified Community Trust & AI Assistant (Col span 4) */}
        <div className="lg:col-span-4 bg-amber-50 text-stone-900 rounded-3xl p-5 border border-amber-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-[10px] font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                Verified Reviews
              </span>
            </div>

            <p className="text-xs italic text-stone-800 mt-2.5 leading-snug">
              "Stylemodiste Crepe fabric texture is 10/10! Made 2 dresses with 5 yards. Arrived in Lagos under 3 hours."
            </p>
            <p className="text-[11px] font-bold text-emerald-900 mt-1">— Mrs. Folake A., Lagos Mainland</p>
          </div>

          <div className="mt-3 pt-2 border-t border-amber-200/80 flex items-center justify-between">
            <button
              onClick={onOpenAiAssistant}
              className="text-xs font-black text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
              <span>Ask Stylemodiste AI Tailor</span>
            </button>
            <span className="text-[10px] font-bold text-stone-500">4.98 Rating (680+ Sales)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
