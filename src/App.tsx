import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Filter, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Store, 
  ShoppingBag, 
  Search, 
  ChevronDown, 
  SlidersHorizontal,
  RefreshCw,
  Heart,
  CheckCircle2,
  Tag,
  Layers,
  Scissors,
  Shirt
} from 'lucide-react';
import { Product, Seller, Category, ConditionGrade, CartItem, Order, LiveActivityEvent, BrandSection } from './types';
import { INITIAL_PRODUCTS, INITIAL_SELLERS, MOCK_RECENT_ACTIVITIES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { DeliveryTrackerModal } from './components/DeliveryTrackerModal';
import { SellerDashboardModal } from './components/SellerDashboardModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LiveActivityBar } from './components/LiveActivityBar';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  // Products & Sellers State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [activities, setActivities] = useState<LiveActivityEvent[]>(MOCK_RECENT_ACTIVITIES);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<BrandSection>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(250000);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');

  // Cart & Saved Items State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [likedProductIds, setLikedProductIds] = useState<string[]>([]);

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Fetch Products from Server API
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSection !== 'all') params.append('section', selectedSection);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedCondition !== 'All') params.append('condition', selectedCondition);
      if (selectedState !== 'All States') params.append('state', selectedState);
      if (searchQuery) params.append('search', searchQuery);
      params.append('maxPrice', maxPriceFilter.toString());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedSection, selectedCategory, selectedCondition, selectedState, searchQuery, maxPriceFilter]);

  // Fetch Live Activity Stream Periodically for Real-Time Feeling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/inventory/live-feed');
        const data = await res.json();
        if (data.success && Array.isArray(data.activities)) {
          setActivities(data.activities);
        }
      } catch (e) {
        // quiet fallback
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Cart Operations
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (product.stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    // Trigger stock reserve in server
    fetch(`/api/products/${product.id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reserve' })
    }).catch(console.error);

    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleInstantCheckout = (product: Product) => {
    handleAddToCart(product);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  // Toggle Favorite
  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle Add Product from Seller Dashboard
  const handleAddProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Real-time Stock Update Handler
  const handleUpdateStock = async (productId: string, delta: number) => {
    try {
      const action = delta > 0 ? 'increment' : 'decrement';
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, delta: Math.abs(delta) })
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.product : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Review Post
  const handleAddReview = async (productId: string, reviewData: any) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? data.product : p))
        );
        setSelectedProduct(data.product);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Merchant Registration
  const handleRegisterSeller = (newSeller: Seller) => {
    setSellers((prev) => [newSeller, ...prev]);
  };

  // Sorted Products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_low') return a.priceNaira - b.priceNaira;
    if (sortBy === 'price_high') return b.priceNaira - a.priceNaira;
    if (sortBy === 'rating') return b.seller.rating - a.seller.rating;
    return 0; // featured
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Navigation Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
        onOpenAiAssistant={() => {
          setAiPrompt('');
          setIsAiAssistantOpen(true);
        }}
      />

      {/* Live Sales & Inventory Ticker Bar */}
      <LiveActivityBar activities={activities} />

      {/* Hero Section */}
      <HeroBanner
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        onExploreClick={() => {
          const el = document.getElementById('marketplace-grid');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSellerDashboard={() => setIsSellerDashboardOpen(true)}
        onOpenAiAssistant={() => {
          setAiPrompt('How many yards of Crepe fabric are needed for a maxi gown?');
          setIsAiAssistantOpen(true);
        }}
      />

      {/* Main Marketplace Area */}
      <main id="marketplace-grid" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full space-y-5 sm:space-y-6">
        
        {/* Interactive Landing Page Section Card Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-700" />
              <span>Select Shopping Section</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Choose your dedicated section card tab
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card Tab 1: Section 1 - Quality Fabrics */}
            <div
              id="card-tab-fabrics"
              onClick={() => {
                setSelectedSection('fabrics');
                setSelectedCategory('All');
              }}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-xs flex flex-col justify-between ${
                selectedSection === 'fabrics'
                  ? 'bg-emerald-950 text-white border-emerald-400 ring-4 ring-emerald-500/30 shadow-md scale-[1.01]'
                  : 'bg-white hover:bg-emerald-50/50 text-slate-900 border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2.5 rounded-xl ${selectedSection === 'fabrics' ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 text-emerald-800'}`}>
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      selectedSection === 'fabrics' ? 'bg-emerald-800 text-amber-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Section 1
                    </span>
                    <h3 className="text-sm sm:text-base font-black mt-1">Quality Fabrics</h3>
                  </div>
                </div>
                {selectedSection === 'fabrics' && (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                )}
              </div>

              <p className={`text-xs mt-3 leading-relaxed ${selectedSection === 'fabrics' ? 'text-emerald-100' : 'text-slate-600'}`}>
                Crepe, Mulberry Silk, Chiffon, Chantilly Lace, Brocade & Embroidered Wrappers.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100/20 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedSection === 'fabrics' ? 'text-amber-300' : 'text-emerald-700'}>
                  Cut-by-Yard & Bales
                </span>
                <span className={`px-2.5 py-1 rounded-lg ${selectedSection === 'fabrics' ? 'bg-emerald-800 text-emerald-200' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedSection === 'fabrics' ? 'Active Section ✓' : 'Select Fabrics →'}
                </span>
              </div>
            </div>

            {/* Card Tab 2: Section 2 - Grade A Thrift Wears */}
            <div
              id="card-tab-thrift"
              onClick={() => {
                setSelectedSection('thrift');
                setSelectedCategory('All');
              }}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-xs flex flex-col justify-between ${
                selectedSection === 'thrift'
                  ? 'bg-slate-900 text-white border-amber-400 ring-4 ring-amber-500/30 shadow-md scale-[1.01]'
                  : 'bg-white hover:bg-amber-50/50 text-slate-900 border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2.5 rounded-xl ${selectedSection === 'thrift' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800'}`}>
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      selectedSection === 'thrift' ? 'bg-slate-800 text-amber-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Section 2
                    </span>
                    <h3 className="text-sm sm:text-base font-black mt-1">Grade A Thrift Wears</h3>
                  </div>
                </div>
                {selectedSection === 'thrift' && (
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                )}
              </div>

              <p className={`text-xs mt-3 leading-relaxed ${selectedSection === 'thrift' ? 'text-slate-300' : 'text-slate-600'}`}>
                Sanitized Grade A Vintage Tops, Y2K Dresses, Denim Jackets, Kicks & Bags.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100/20 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedSection === 'thrift' ? 'text-amber-300' : 'text-amber-700'}>
                  1-of-1 Pre-Loved Vault
                </span>
                <span className={`px-2.5 py-1 rounded-lg ${selectedSection === 'thrift' ? 'bg-slate-800 text-amber-200' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedSection === 'thrift' ? 'Active Section ✓' : 'Select Thrift →'}
                </span>
              </div>
            </div>

            {/* Card Tab 3: All Sections Combined */}
            <div
              id="card-tab-all"
              onClick={() => {
                setSelectedSection('all');
                setSelectedCategory('All');
              }}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden shadow-xs flex flex-col justify-between ${
                selectedSection === 'all'
                  ? 'bg-stone-800 text-white border-teal-400 ring-4 ring-teal-500/30 shadow-md scale-[1.01]'
                  : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2.5 rounded-xl ${selectedSection === 'all' ? 'bg-teal-400 text-stone-950' : 'bg-slate-100 text-slate-800'}`}>
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      selectedSection === 'all' ? 'bg-stone-700 text-teal-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Full Hub
                    </span>
                    <h3 className="text-sm sm:text-base font-black mt-1">All Items & Bales</h3>
                  </div>
                </div>
                {selectedSection === 'all' && (
                  <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
                )}
              </div>

              <p className={`text-xs mt-3 leading-relaxed ${selectedSection === 'all' ? 'text-stone-300' : 'text-slate-600'}`}>
                Browse everything across both Sections 1 & 2 plus verified wholesale merchant drops.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100/20 flex items-center justify-between text-[11px] font-bold">
                <span className={selectedSection === 'all' ? 'text-teal-300' : 'text-slate-700'}>
                  Combined Marketplace
                </span>
                <span className={`px-2.5 py-1 rounded-lg ${selectedSection === 'all' ? 'bg-stone-700 text-stone-200' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedSection === 'all' ? 'Active Hub ✓' : 'View All →'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Category Pill Quick Sub-Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Categories:</span>
          </span>
          {(selectedSection === 'fabrics' 
            ? ['All', 'Crepe Fabrics', 'Silk & Satin', 'Chiffon & Organza', 'Chantilly Lace', 'Wrappers & Traditional', 'Brocade & Cashmere']
            : selectedSection === 'thrift'
            ? ['All', 'Thrift Tops & Dresses', 'Y2K & Vintage Wears', 'Grade A Denim & Jackets', 'Thrift Kicks & Shoes', 'Pre-Loved Luxury Bags']
            : ['All', 'Crepe Fabrics', 'Silk & Satin', 'Chantilly Lace', 'Thrift Tops & Dresses', 'Grade A Denim & Jackets', 'Thrift Kicks & Shoes']
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-emerald-900 text-amber-300 border-emerald-800 shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Marketplace Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto">
            <span className="font-bold text-slate-700 flex items-center gap-1 shrink-0">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Filters:</span>
            </span>

            {/* Condition Filter */}
            <select
              id="filter-condition-select"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-semibold text-slate-800 outline-none cursor-pointer hover:bg-slate-100 text-xs min-h-[38px]"
            >
              <option value="All">All Grades</option>
              <option value="Grade A+">Grade A+ (Like New)</option>
              <option value="Grade A">Grade A (Gently Used)</option>
              <option value="Vintage / Retro">Vintage / Retro</option>
              <option value="Custom Upcycled">Custom Upcycled</option>
            </select>

            {/* Price Cap Filter */}
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl min-h-[38px]">
              <span className="text-slate-500 font-medium text-xs">Max:</span>
              <span className="font-bold text-emerald-950 text-xs">₦{maxPriceFilter.toLocaleString()}</span>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="w-20 sm:w-24 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Sort Control & Total Found */}
          <div className="flex items-center justify-between sm:justify-end space-x-3 text-xs w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <span className="text-slate-500 font-medium text-[11px] sm:text-xs">
              Showing <strong className="text-slate-900">{sortedProducts.length}</strong> items
            </span>

            <select
              id="sort-select"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 outline-none cursor-pointer text-xs min-h-[38px]"
            >
              <option value="featured">Featured Drops</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Seller Rating</option>
            </select>
          </div>

        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {sortedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(p) => setSelectedProduct(p)}
                onAddToCart={(p, e) => handleAddToCart(p, e)}
                onToggleLike={(id, e) => handleToggleLike(id, e)}
                isLiked={likedProductIds.includes(prod.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">No Thrift Items Match Your Search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting your category or state filter to view verified Grade A Okrika listings across Nigeria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCondition('All');
                setSelectedState('All States');
                setSearchQuery('');
                setMaxPriceFilter(200000);
              }}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-amber-300 font-bold rounded-xl text-xs cursor-pointer shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-900 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white font-black text-lg">
                <span className="text-emerald-400">Stylemodiste</span>
                <span className="text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full bg-stone-900 border border-stone-800">
                  Fabrics & Thrift
                </span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Nigeria's premier fashion brand providing beautiful, quality & affordable fabrics (Crepe, Silk, Chiffon, Chantilly, Wrappers) and Grade A thrift wears across Lagos, Abuja, Port Harcourt, and nationwide.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Stylemodiste Sections</h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>• Section 1: Quality Fabrics (Crepe & Mulberry Silk)</li>
                <li>• Section 1: Chantilly Lace & Traditional Wrappers</li>
                <li>• Section 2: Grade A Thrift Tops & Dresses</li>
                <li>• Section 2: Y2K Vintage Denim & Kicks</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Logistics & Delivery</h4>
              <ul className="space-y-1.5 text-stone-400">
                <li>• GIG Logistics (GIGL) Waybill</li>
                <li>• Kwik Same-Day Motor Dispatch</li>
                <li>• Speedaf Doorstep Interstate Delivery</li>
                <li>• Real-Time Tracking Integration</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Buyer Trust & Escrow</h4>
              <div className="bg-stone-900 p-3 rounded-2xl border border-stone-800 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Paystack Escrow Guarantee</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Funds released only after buyer receives and verifies fabric yards or thrift wear condition.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-900 flex flex-wrap justify-between items-center text-[11px] text-stone-500">
            <span>© {new Date().getFullYear()} Stylemodiste Brand Hub. All rights reserved. Built for Nigeria 🇳🇬</span>
            <div className="flex space-x-4">
              <span>Paystack Escrow Protected</span>
              <span>•</span>
              <span>Quality Fabrics & Thrift</span>
              <span>•</span>
              <span>24hr Express Delivery</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => handleAddToCart(p)}
          onInstantCheckout={(p) => handleInstantCheckout(p)}
          onAddReview={handleAddReview}
          onAskAi={(prompt) => {
            setAiPrompt(prompt);
            setIsAiAssistantOpen(true);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setIsCheckoutOpen(false)}
          onClearCart={() => setCart([])}
          onOrderSuccess={(order) => {
            setLastPlacedOrder(order);
          }}
        />
      )}

      {/* Localized Delivery Tracker Modal */}
      {isTrackingOpen && (
        <DeliveryTrackerModal
          initialWaybill={lastPlacedOrder?.waybillNumber || 'GIGL-LOS-ABJ-99201'}
          onClose={() => setIsTrackingOpen(false)}
        />
      )}

      {/* Seller Dashboard & Onboarding Modal */}
      {isSellerDashboardOpen && (
        <SellerDashboardModal
          sellers={sellers}
          products={products}
          onClose={() => setIsSellerDashboardOpen(false)}
          onAddProduct={handleAddProduct}
          onUpdateStock={handleUpdateStock}
          onRegisterSeller={handleRegisterSeller}
        />
      )}

      {/* Gemini AI Style & Valuation Concierge Modal */}
      {isAiAssistantOpen && (
        <AiAssistantModal
          initialPrompt={aiPrompt}
          onClose={() => setIsAiAssistantOpen(false)}
        />
      )}

    </div>
  );
}
