import React from 'react';
import { Heart, MapPin, ShieldCheck, ShoppingCart, Flame, Star, Scissors, Shirt } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToCart: (p: Product, e: React.MouseEvent) => void;
  onToggleLike?: (id: string, e: React.MouseEvent) => void;
  isLiked?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleLike,
  isLiked = false
}) => {
  const discountPercent = Math.round(
    ((product.originalPriceNaira - product.priceNaira) / product.originalPriceNaira) * 100
  );

  const isFabric = product.section === 'fabrics';

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="group bg-white rounded-3xl border border-stone-200 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative transform hover:-translate-y-1"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 sm:aspect-square bg-stone-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-stone-950/20 opacity-80 pointer-events-none"></div>

        {/* Top Section & Condition Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden">
            <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shadow-xs backdrop-blur-md flex items-center gap-1 shrink-0 ${
              isFabric 
                ? 'bg-emerald-900/90 text-amber-300 border border-emerald-700/60' 
                : 'bg-stone-900/90 text-amber-300 border border-stone-700/60'
            }`}>
              {isFabric ? <Scissors className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" /> : <Shirt className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />}
              <span>{isFabric ? 'Fabric' : 'Thrift'}</span>
            </span>

            <span className="bg-stone-900/80 text-stone-200 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-md truncate hidden sm:inline-block">
              {product.condition}
            </span>
          </div>

          <button
            id={`like-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike?.(product.id, e);
            }}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center ${
              isLiked
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-stone-700 hover:text-red-500'
            }`}
            title="Save to Favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Overlay Badges: Real-time Stock & Discount */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between text-xs">
          {product.stock <= 0 ? (
            <span className="bg-red-600 text-white font-black px-2 py-0.5 sm:px-2.5 rounded-full text-[9px] sm:text-[10px] tracking-wider uppercase">
              Sold Out
            </span>
          ) : product.stock === 1 ? (
            <span className="bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] flex items-center gap-1 shadow-xs animate-pulse">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-stone-950" /> 1 Left!
            </span>
          ) : (
            <span className="bg-stone-900/80 backdrop-blur-md text-emerald-300 font-bold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[9px] sm:text-[10px]">
              {product.stock} available
            </span>
          )}

          {discountPercent > 0 && (
            <span className="bg-emerald-700 text-white font-black px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px]">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        
        <div className="space-y-1 sm:space-y-1.5">
          {/* Location & Category Pill */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-stone-500 font-medium">
            <span className="truncate max-w-[100px] sm:max-w-[140px] font-semibold text-emerald-900">{product.category}</span>
            <span className="flex items-center gap-0.5 text-stone-600 font-semibold shrink-0">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-700" />
              {product.location.split(',')[0]}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-900 text-xs sm:text-base line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {product.title}
          </h3>

          {/* Fabric Specification or Size Tag */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 pt-0.5 text-xs text-stone-600">
            {isFabric && product.fabricSpec ? (
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-lg font-bold text-[10px] sm:text-[11px] truncate">
                🧵 {product.fabricSpec.yardsPerPiece} Yds ({product.fabricSpec.fabricType})
              </span>
            ) : (
              <span className="bg-stone-100 text-stone-800 px-1.5 sm:px-2 py-0.5 rounded-lg font-bold text-[10px] sm:text-[11px]">
                Size: {product.size}
              </span>
            )}
            <span className="text-[10px] sm:text-[11px] text-stone-500">• {product.gender}</span>
          </div>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-1.5 sm:pt-2 border-t border-stone-100 flex items-center justify-between gap-1 sm:gap-2">
          
          <div>
            <div className="text-sm sm:text-lg font-black text-emerald-950 flex items-baseline gap-1">
              <span>₦{product.priceNaira.toLocaleString()}</span>
            </div>
            {product.originalPriceNaira > product.priceNaira && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through block">
                ₦{product.originalPriceNaira.toLocaleString()}
              </span>
            )}
          </div>

          <button
            id={`add-cart-btn-${product.id}`}
            disabled={product.stock <= 0}
            onClick={(e) => onAddToCart(product, e)}
            className={`p-2 sm:p-2.5 min-h-[38px] min-w-[38px] sm:min-h-[44px] sm:min-w-[44px] rounded-xl sm:rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer ${
              product.stock <= 0
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-emerald-800 hover:bg-emerald-900 text-amber-300 shadow-2xs active:scale-95'
            }`}
            title={product.stock <= 0 ? 'Item Sold Out' : 'Add to Bag'}
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

        </div>

        {/* Seller Info Bar */}
        <div className="pt-1.5 sm:pt-2 border-t border-stone-100/80 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center space-x-1 sm:space-x-1.5 truncate">
            <img
              src={product.seller.avatar}
              alt={product.seller.storeName}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="font-semibold text-stone-800 text-[10px] sm:text-[11px] truncate">
              {product.seller.storeName}
            </span>
            {product.seller.bvnVerified && (
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" title="BVN Verified Brand" />
            )}
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-bold text-amber-700 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.seller.rating}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
