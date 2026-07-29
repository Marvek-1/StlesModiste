import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  Store, 
  Truck, 
  Sparkles, 
  Scissors, 
  Shirt, 
  Layers, 
  PlusCircle, 
  Sparkle
} from 'lucide-react';
import { Category, BrandSection } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (c: Category) => void;
  selectedSection: BrandSection;
  setSelectedSection: (s: BrandSection) => void;
  selectedState: string;
  setSelectedState: (s: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onOpenSellerDashboard: () => void;
  onOpenAiAssistant: () => void;
}

export const FABRIC_CATEGORIES: Category[] = [
  'All',
  'Crepe Fabrics',
  'Silk & Satin',
  'Chiffon & Organza',
  'Chantilly Lace',
  'Wrappers & Traditional',
  'Brocade & Cashmere'
];

export const THRIFT_CATEGORIES: Category[] = [
  'All',
  'Thrift Tops & Dresses',
  'Y2K & Vintage Wears',
  'Grade A Denim & Jackets',
  'Thrift Kicks & Shoes',
  'Pre-Loved Luxury Bags',
  'Unisex Thrift Streetwear'
];

export const STATES_LIST = ['All States', 'Lagos', 'Abuja FCT', 'Rivers', 'Oyo', 'Enugu', 'Kano'];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSection,
  setSelectedSection,
  selectedState,
  setSelectedState,
  cartCount,
  onOpenCart,
  onOpenTracking,
  onOpenSellerDashboard,
  onOpenAiAssistant
}) => {
  const currentCategories = selectedSection === 'fabrics' 
    ? FABRIC_CATEGORIES 
    : selectedSection === 'thrift' 
    ? THRIFT_CATEGORIES 
    : ['All' as Category, ...FABRIC_CATEGORIES.slice(1), ...THRIFT_CATEGORIES.slice(1)];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Ticker */}
      <div className="bg-emerald-900 text-stone-100 px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2 overflow-hidden whitespace-nowrap">
          <span className="bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
            Official Brand Hub
          </span>
          <span className="truncate text-stone-200">
            ✨ <strong className="text-white">Stylemodiste</strong> • Section 1: Quality Fabrics (Crepe, Silk, Chiffon, Chantilly, Wrappers) | Section 2: Grade A Thrift Wears • Paystack Escrow
          </span>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-4 shrink-0 text-[11px] text-emerald-200">
          <button 
            id="nav-track-order-top"
            onClick={onOpenTracking} 
            className="hover:text-amber-300 flex items-center space-x-1 transition-colors cursor-pointer text-white font-bold bg-emerald-800/80 hover:bg-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-700"
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Order</span>
          </button>
          <span className="text-emerald-500">•</span>
          <button 
            id="nav-ai-assistant-top"
            onClick={onOpenAiAssistant} 
            className="hover:text-amber-200 flex items-center space-x-1 text-amber-300 transition-colors cursor-pointer font-extrabold bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
            <span>AI Style & Yard Concierge</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Stylemodiste Logo */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-emerald-800 text-white p-2.5 rounded-2xl shadow-sm flex items-center justify-center border border-emerald-700">
              <Scissors className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 flex items-center gap-1">
                Style<span className="text-emerald-700">modiste</span>
              </span>
              <span className="hidden sm:block text-[10px] text-stone-500 font-bold tracking-wider uppercase">
                Fabrics & Thrift Fashion
              </span>
            </div>
          </div>

          {/* Section Selector Switcher (Fabrics vs Thrift) */}
          <div className="hidden lg:flex items-center bg-stone-200/70 p-1 rounded-2xl border border-stone-300/60 shrink-0">
            <button
              id="section-nav-all"
              onClick={() => {
                setSelectedSection('all');
                setSelectedCategory('All');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedSection === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>All Hub</span>
            </button>

            <button
              id="section-nav-fabrics"
              onClick={() => {
                setSelectedSection('fabrics');
                setSelectedCategory('All');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedSection === 'fabrics'
                  ? 'bg-emerald-800 text-white shadow-xs ring-1 ring-emerald-600'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-amber-300" />
              <span>Fabrics Section</span>
            </button>

            <button
              id="section-nav-thrift"
              onClick={() => {
                setSelectedSection('thrift');
                setSelectedCategory('All');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedSection === 'thrift'
                  ? 'bg-emerald-800 text-white shadow-xs ring-1 ring-emerald-600'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <Shirt className="w-3.5 h-3.5 text-amber-300" />
              <span>Thrift Section</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl mx-1 sm:mx-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="search-input-main"
                type="text"
                placeholder={
                  selectedSection === 'fabrics' 
                    ? "Search crepe, silk, chiffon, Chantilly lace, wrappers..."
                    : selectedSection === 'thrift'
                    ? "Search Grade A dresses, Y2K tops, vintage denim..."
                    : "Search Stylemodiste fabrics or thrift wears..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-24 py-2 bg-white hover:bg-stone-100/80 focus:bg-white text-stone-900 border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 rounded-2xl text-sm transition-all outline-none"
              />
              
              {/* Location Select Pill inside Search */}
              <div className="absolute right-1.5 flex items-center">
                <select
                  id="state-filter-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-stone-100 text-xs font-semibold text-emerald-900 border border-stone-200 rounded-xl px-2 py-1 cursor-pointer outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {STATES_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Track Order Button */}
            <button
              id="btn-track-order"
              onClick={onOpenTracking}
              className="p-2 sm:px-3 sm:py-2 min-h-[40px] sm:min-h-[44px] text-stone-700 hover:text-emerald-800 bg-stone-200/80 hover:bg-stone-200 rounded-2xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Track Order"
            >
              <Truck className="w-4 h-4 text-emerald-800" />
              <span className="hidden md:inline">Track</span>
            </button>

            {/* AI Assistant */}
            <button
              id="btn-ai-assistant"
              onClick={onOpenAiAssistant}
              className="p-2 sm:px-3 sm:py-2 min-h-[40px] sm:min-h-[44px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
              <span className="hidden sm:inline">AI Tailor & Style</span>
            </button>

            {/* Seller Hub Button */}
            <button
              id="btn-seller-dashboard"
              onClick={onOpenSellerDashboard}
              className="px-2.5 py-2 sm:px-3 sm:py-2 min-h-[40px] sm:min-h-[44px] bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Seller Portal</span>
              <PlusCircle className="w-3.5 h-3.5 opacity-80 hidden sm:inline" />
            </button>

            {/* Cart Button */}
            <button
              id="btn-open-cart"
              onClick={onOpenCart}
              className="relative p-2.5 sm:p-2.5 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] bg-stone-900 hover:bg-stone-800 text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Section Switcher Pills */}
        <div className="lg:hidden mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setSelectedSection('all');
              setSelectedCategory('All');
            }}
            className={`flex-1 py-2 min-h-[42px] text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
              selectedSection === 'all' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-200 text-stone-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>All</span>
          </button>
          <button
            onClick={() => {
              setSelectedSection('fabrics');
              setSelectedCategory('All');
            }}
            className={`flex-1 py-2 min-h-[42px] text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
              selectedSection === 'fabrics' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-200 text-stone-700'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-amber-300" />
            <span>🧵 Fabrics</span>
          </button>
          <button
            onClick={() => {
              setSelectedSection('thrift');
              setSelectedCategory('All');
            }}
            className={`flex-1 py-2 min-h-[42px] text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
              selectedSection === 'thrift' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-stone-200 text-stone-700'
            }`}
          >
            <Shirt className="w-3.5 h-3.5 text-amber-300" />
            <span>👗 Thrift</span>
          </button>
        </div>

        {/* Categories Horizontal Scroll Bar */}
        <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1">
          {currentCategories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 min-h-[38px] rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center shrink-0 ${
                  active
                    ? 'bg-emerald-800 text-white shadow-xs ring-2 ring-emerald-600/30'
                    : 'bg-stone-200/80 text-stone-800 hover:bg-stone-300 hover:text-stone-950'
                }`}
              >
                {cat === 'All' ? '✨ All Categories' : cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
