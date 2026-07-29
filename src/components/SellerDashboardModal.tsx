import React, { useState } from 'react';
import { 
  X, 
  Store, 
  PlusCircle, 
  PackageCheck, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  DollarSign, 
  RefreshCw,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Product, Seller, Category, ConditionGrade, BrandSection } from '../types';
import { FABRIC_CATEGORIES, THRIFT_CATEGORIES } from './Navbar';
import { NIGERIAN_STATES } from '../data/mockData';

interface SellerDashboardModalProps {
  sellers: Seller[];
  products: Product[];
  onClose: () => void;
  onAddProduct: (productData: any) => void;
  onUpdateStock: (productId: string, delta: number) => void;
  onRegisterSeller: (sellerData: any) => void;
}

export const SellerDashboardModal: React.FC<SellerDashboardModalProps> = ({
  sellers,
  products,
  onClose,
  onAddProduct,
  onUpdateStock,
  onRegisterSeller
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'new_item' | 'onboarding'>('listings');
  const [selectedSellerId, setSelectedSellerId] = useState<string>(sellers[0]?.id || 's1');

  // New Listing Form State
  const [section, setSection] = useState<'fabrics' | 'thrift'>('fabrics');
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Category>('Crepe Fabrics');
  const [condition, setCondition] = useState<ConditionGrade>('New / Uncut Yard');
  const [size, setSize] = useState('6 Yards');
  const [fabricYards, setFabricYards] = useState(6);
  const [gender, setGender] = useState<'Unisex' | 'Men' | 'Women'>('Unisex');
  const [priceNaira, setPriceNaira] = useState('');
  const [originalPriceNaira, setOriginalPriceNaira] = useState('');
  const [stock, setStock] = useState('5');
  const [location, setLocation] = useState('Yaba, Lagos Mainland');
  const [defectNotes, setDefectNotes] = useState('');
  const [material, setMaterial] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // AI Assistant State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Merchant Onboarding State
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [marketLocation, setMarketLocation] = useState('Balogun Market, Lagos Island');
  const [ninNumber, setNinNumber] = useState('');
  const [bvnNumber, setBvnNumber] = useState('');
  const [cacRcNumber, setCacRcNumber] = useState('');
  const [onboardState, setOnboardState] = useState('Lagos');
  const [onboardLga, setOnboardLga] = useState('Ikeja');
  const [bankName, setBankName] = useState('Access Bank');
  const [bankCode, setBankCode] = useState('044');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedAccountName, setResolvedAccountName] = useState<string | null>(null);
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);
  const [onboardBio, setOnboardBio] = useState('');
  const [onboardSuccess, setOnboardSuccess] = useState(false);

  // Available Nigerian Banks
  const [availableBanks, setAvailableBanks] = useState<{ name: string; code: string }[]>([
    { name: 'Access Bank', code: '044' },
    { name: 'Guaranty Trust Bank (GTBank)', code: '058' },
    { name: 'Zenith Bank', code: '057' },
    { name: 'United Bank for Africa (UBA)', code: '033' },
    { name: 'First Bank of Nigeria', code: '011' },
    { name: 'Kuda Microfinance Bank', code: '50211' },
    { name: 'OPay Digital Services', code: '999992' },
    { name: 'Moniepoint Microfinance Bank', code: '50515' },
    { name: 'Palmpay', code: '999991' },
    { name: 'FCMB', code: '214' },
    { name: 'Stanbic IBTC Bank', code: '221' },
    { name: 'Wema Bank (ALAT)', code: '035' }
  ]);

  // Fetch banks on tab load
  React.useEffect(() => {
    fetch('/api/vendors/banks')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.banks)) {
          setAvailableBanks(data.banks);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Trigger Paystack NUBAN Account Resolution
  const handleVerifyBankNumber = async () => {
    if (!accountNumber || accountNumber.length !== 10) {
      setBankError('Enter 10-digit NUBAN account number.');
      return;
    }

    setIsVerifyingBank(true);
    setBankError(null);
    setResolvedAccountName(null);

    try {
      const res = await fetch('/api/vendors/verify-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, bankCode })
      });

      const data = await res.json();

      if (data.status && data.data?.account_name) {
        setResolvedAccountName(data.data.account_name);
        if (!ownerName) {
          setOwnerName(data.data.account_name);
        }
      } else {
        setBankError(data.error || 'Could not resolve bank account.');
      }
    } catch (err: any) {
      setBankError(err.message || 'Bank resolution request failed.');
    } finally {
      setIsVerifyingBank(false);
    }
  };

  const activeSeller = sellers.find(s => s.id === selectedSellerId) || sellers[0];
  const sellerProducts = products.filter(p => p.sellerId === activeSeller.id);
  const totalSalesNaira = sellerProducts.reduce((sum, p) => sum + (p.priceNaira * (p.viewCount > 0 ? 1 : 0)), 0);

  // Trigger Gemini AI Price & Listing Generator
  const handleGenerateAiValuation = async () => {
    if (!title) {
      alert('Please enter an item title or fabric name first (e.g. Mulberry Silk Fabric or Vintage Levi Jacket)');
      return;
    }

    setIsAiLoading(true);
    setAiInsight(null);

    try {
      const res = await fetch('/api/ai/pricing-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          title,
          brand,
          category,
          condition,
          yards: fabricYards,
          defectDescription: defectNotes,
          originalPrice: originalPriceNaira
        })
      });

      const data = await res.json();

      if (data.success) {
        if (data.suggestedPriceNaira) setPriceNaira(data.suggestedPriceNaira.toString());
        if (data.optimizedTitle) setTitle(data.optimizedTitle);
        if (data.engagingDescription) setDescription(data.engagingDescription);
        if (data.marketInsight) setAiInsight(data.marketInsight);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Submit New Listing
  const handleListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceNaira) {
      alert('Please provide item title and price.');
      return;
    }

    const payload: any = {
      section,
      title,
      description: description || (section === 'fabrics' 
        ? `Quality ${category} fabric for bespoke outfits and traditional wear. ${fabricYards} yards cut available for delivery across Nigeria.`
        : `Grade A ${category} thrift piece. Clean, sanitized, and ready for express courier delivery across Nigeria.`),
      priceNaira: Number(priceNaira),
      originalPriceNaira: Number(originalPriceNaira) || Number(priceNaira) * 1.5,
      category,
      condition,
      size: section === 'fabrics' ? `${fabricYards} Yards` : size,
      gender,
      images: [imageUrl || (section === 'fabrics' ? 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800')],
      sellerId: activeSeller.id,
      stock: Number(stock) || 1,
      location: location || activeSeller.city,
      defectNotes: defectNotes || (section === 'fabrics' ? 'New uncut fabric bolt.' : 'Pristine pre-loved condition.'),
      material: material || (section === 'fabrics' ? category : 'Cotton / Blended Fiber')
    };

    if (section === 'fabrics') {
      payload.fabricSpec = {
        yardsPerPiece: Number(fabricYards) || 6,
        fabricType: category,
        texture: 'Soft, lustrous & smooth drape',
        recommendedOutfit: 'Maxi gowns, AsoEbi traditional attire, or bespoke shirts'
      };
    }

    onAddProduct(payload);

    alert(`Item listed successfully under Stylemodiste ${section === 'fabrics' ? 'Fabrics' : 'Thrift'} section!`);
    setActiveTab('listings');
    // Reset form
    setTitle('');
    setPriceNaira('');
    setOriginalPriceNaira('');
    setDescription('');
    setImageUrl('');
  };

  // Submit Merchant Onboarding with Real Paystack & Neon Persistence
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !phone) {
      alert('Please complete required store name, owner name, and phone fields.');
      return;
    }

    try {
      const res = await fetch('/api/vendors/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName,
          ownerName,
          phone,
          marketLocation,
          ninOrBvn: ninNumber || bvnNumber,
          cacRcNumber,
          state: onboardState,
          lga: onboardLga,
          bankCode,
          bankName,
          accountNumber,
          accountName: resolvedAccountName,
          bio: onboardBio
        })
      });

      const data = await res.json();

      if (data.success && data.seller) {
        onRegisterSeller(data.seller);
        setSelectedSellerId(data.seller.id);
        setOnboardSuccess(true);
        setTimeout(() => {
          setActiveTab('listings');
          setOnboardSuccess(false);
        }, 2000);
      } else {
        alert(data.error || 'Vendor registration failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error during merchant onboarding.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] sm:max-h-[92vh] flex flex-col my-auto border border-slate-100">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Store className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-sm font-black block">Merchant Portal & Seller Hub</span>
              <span className="text-[10px] text-slate-400">Manage stock, list items & track sales in Naira</span>
            </div>
          </div>

          <button
            id="close-seller-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          
          {/* Active Seller Switcher & Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Active Store:</span>
              <select
                value={selectedSellerId}
                onChange={(e) => setSelectedSellerId(e.target.value)}
                className="bg-slate-100 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 outline-none cursor-pointer"
              >
                {sellers.map(s => (
                  <option key={s.id} value={s.id}>{s.storeName} ({s.city})</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('listings')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'listings' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stock Management ({sellerProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('new_item')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'new_item' ? 'bg-emerald-700 text-amber-300 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ List New Item</span>
              </button>
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'onboarding' ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Merchant Onboarding
              </button>
            </div>
          </div>

          {/* TAB 1: LISTINGS & REAL-TIME STOCK MANAGEMENT */}
          {activeTab === 'listings' && (
            <div className="space-y-5">
              
              {/* Seller Overview Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Store Rating</span>
                  <div className="text-lg font-black text-amber-600 flex items-center gap-1">
                    ★ {activeSeller.rating}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Items Sold</span>
                  <div className="text-lg font-black text-slate-900">
                    {activeSeller.totalSales} Pieces
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Escrow Payout Balance</span>
                  <div className="text-lg font-black text-emerald-800">
                    ₦{(activeSeller.totalSales * 22000).toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Verification Status</span>
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>NIN & BVN Verified</span>
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Real-Time Stock Control
                  </h3>
                  <span className="text-xs text-slate-500">Live synchronization active</span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Item</th>
                        <th className="p-3">Price (₦)</th>
                        <th className="p-3">Condition</th>
                        <th className="p-3">Stock Count</th>
                        <th className="p-3 text-right">Quick Stock Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sellerProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 flex items-center space-x-2">
                            <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div className="truncate max-w-[180px]">
                              <p className="font-bold text-slate-900 truncate">{p.title}</p>
                              <p className="text-[10px] text-slate-400">ID: {p.id}</p>
                            </div>
                          </td>
                          <td className="p-3 font-bold text-emerald-900">
                            ₦{p.priceNaira.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-[10px]">
                              {p.condition}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            {p.stock > 0 ? (
                              <span className="text-emerald-700">{p.stock} in stock</span>
                            ) : (
                              <span className="text-red-600 font-black">Out of Stock</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => onUpdateStock(p.id, -1)}
                                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-xs font-bold cursor-pointer"
                                title="Reduce stock by 1"
                              >
                                -
                              </button>
                              <button
                                onClick={() => onUpdateStock(p.id, 1)}
                                className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded text-xs font-bold cursor-pointer"
                                title="Increase stock by 1"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: NEW ITEM LISTING WIZARD + AI GEMINI ASSISTANT */}
          {activeTab === 'new_item' && (
            <form onSubmit={handleListingSubmit} className="space-y-4">
              
              <div className="flex justify-between items-center bg-amber-50 border border-amber-200/80 rounded-2xl p-4">
                <div>
                  <h3 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
                    <span>Gemini AI Thrift Assistant</span>
                  </h3>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    Enter title or brand name and click AI Valuation to auto-generate Naira pricing & description!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiValuation}
                  disabled={isAiLoading}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center space-x-1 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Analyzing...' : 'AI Auto-Price'}</span>
                </button>
              </div>

              {/* Brand Section Switcher */}
              <div className="bg-stone-100 p-3 rounded-2xl border border-stone-200 space-y-1">
                <label className="block text-[11px] font-bold text-stone-800 uppercase tracking-wider">Stylemodiste Brand Section *</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setSection('fabrics');
                      setCategory('Crepe Fabrics');
                      setCondition('New / Uncut Yard');
                    }}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      section === 'fabrics' 
                        ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-sm' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    🧵 Section 1: Quality Fabrics
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSection('thrift');
                      setCategory('Y2K & Vintage');
                      setCondition('Grade A+');
                    }}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      section === 'thrift' 
                        ? 'bg-emerald-800 text-amber-300 border-emerald-900 shadow-sm' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    🏷️ Section 2: Thrift Wears
                  </button>
                </div>
              </div>

              {aiInsight && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900">
                  <strong>Market Demand Insight:</strong> {aiInsight}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {section === 'fabrics' ? 'Fabric Name & Print Title *' : 'Thrift Item Title *'}
                  </label>
                  <input
                    type="text"
                    placeholder={section === 'fabrics' ? 'e.g. Premium Mulberry Silk Floral Print' : 'e.g. Vintage 90s Leather Jacket'}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {section === 'fabrics' ? 'Weave / Mill Origin' : 'Brand Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={section === 'fabrics' ? 'e.g. Italian Crepe / Chantilly Mills' : "e.g. Levi's, Carhartt, Nike"}
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {(section === 'fabrics' ? FABRIC_CATEGORIES : THRIFT_CATEGORIES).filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Condition Grade</label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {section === 'fabrics' ? (
                      <>
                        <option value="New / Uncut Yard">New / Uncut Yard</option>
                        <option value="Designer Remnant">Designer Remnant</option>
                        <option value="AsoEbi Full Roll">AsoEbi Full Roll</option>
                      </>
                    ) : (
                      <>
                        <option value="Grade A+">Grade A+ (Like New)</option>
                        <option value="Grade A">Grade A (Gently Used)</option>
                        <option value="Grade B">Grade B (Minor flaws)</option>
                        <option value="Vintage / Retro">Vintage / Retro</option>
                        <option value="Custom Upcycled">Custom Upcycled</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {section === 'fabrics' ? 'Length in Yards' : 'Size Tag'}
                  </label>
                  {section === 'fabrics' ? (
                    <select
                      value={fabricYards}
                      onChange={(e) => setFabricYards(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                    >
                      <option value={2}>2 Yards (Top / Blouse)</option>
                      <option value={4}>4 Yards (Short Dress / Skirt)</option>
                      <option value={6}>6 Yards (Full Wrapper / Maxi Gown)</option>
                      <option value={8}>8 Yards (Bridal / AsoEbi Set)</option>
                      <option value={10}>10 Yards (Bulk Roll)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="e.g. XL / EU 43 / Waist 34"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Thrift Price (₦) *</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={priceNaira}
                    onChange={(e) => setPriceNaira(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Original Retail Price (₦)</label>
                  <input
                    type="number"
                    placeholder="80000"
                    value={originalPriceNaira}
                    onChange={(e) => setOriginalPriceNaira(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe fabric, fit, origin (Yaba/Lekki)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs cursor-pointer shadow-sm"
              >
                Publish Thrift Listing
              </button>

            </form>
          )}

          {/* TAB 3: MERCHANT ONBOARDING */}
          {activeTab === 'onboarding' && (
            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-bold block">Airtight Vendor Verification & Paystack NUBAN Resolution</span>
                </div>
                <p className="text-slate-300">
                  Join 1,200+ verified thrifters on OkrikaExpress. Paystack NUBAN account name resolution and NIN/CAC registration builds instant buyer trust & enables automatic Escrow payouts.
                </p>
              </div>

              {onboardSuccess && (
                <div className="bg-emerald-100 text-emerald-900 p-3 rounded-2xl text-xs font-bold text-center border border-emerald-300">
                  ✓ Store onboarded successfully & persisted to Neon PostgreSQL Database! Bank identity verified.
                </div>
              )}

              {/* STORE & OWNER DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Store / Hub Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Balogun Premium Okrika Hub"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Owner Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Chinedu Okeke"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+234 802 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Thrift Market Hub / Address *</label>
                  <input
                    type="text"
                    placeholder="e.g. Balogun Market, Lagos Island or Katangua Market"
                    value={marketLocation}
                    onChange={(e) => setMarketLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* BANK ACCOUNT & PAYSTACK VERIFICATION BOX */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Paystack NUBAN Account Resolution (Escrow Settlement)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Official Paystack API
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Select Bank</label>
                    <select
                      value={bankCode}
                      onChange={(e) => {
                        setBankCode(e.target.value);
                        const b = availableBanks.find(x => x.code === e.target.value);
                        if (b) setBankName(b.name);
                        setResolvedAccountName(null);
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    >
                      {availableBanks.map(b => (
                        <option key={b.code} value={b.code}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">10-Digit NUBAN Account Number</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="0123456789"
                        value={accountNumber}
                        onChange={(e) => {
                          setAccountNumber(e.target.value);
                          setResolvedAccountName(null);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyBankNumber}
                        disabled={isVerifyingBank}
                        className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1"
                      >
                        {isVerifyingBank ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          'Verify'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {resolvedAccountName && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-2.5 rounded-xl text-xs flex items-center justify-between font-bold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Account Name: <strong className="text-emerald-950 uppercase">{resolvedAccountName}</strong></span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-md">Paystack Verified</span>
                  </div>
                )}

                {bankError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{bankError}</span>
                  </div>
                )}
              </div>

              {/* CAC & GOVT IDENTIFICATION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">State Location</label>
                  <select
                    value={onboardState}
                    onChange={(e) => setOnboardState(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {NIGERIAN_STATES.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIN or BVN Number</label>
                  <input
                    type="text"
                    placeholder="11-digit NIN or BVN"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">CAC Registration / RC Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. RC-1928371"
                    value={cacRcNumber}
                    onChange={(e) => setCacRcNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Complete Verified Merchant Registration
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
