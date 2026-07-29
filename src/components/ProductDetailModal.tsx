import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ShoppingBag, 
  Star, 
  MapPin, 
  MessageCircle, 
  CheckCircle2, 
  Tag, 
  AlertCircle,
  ThumbsUp,
  Share2,
  Calendar,
  Scissors,
  Copy,
  Check
} from 'lucide-react';
import { Product, ProductReview } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onInstantCheckout: (product: Product) => void;
  onAddReview: (productId: string, review: { rating: number; comment: string; fitFeedback: string; userName: string }) => void;
  onAskAi: (prompt: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantCheckout,
  onAddReview,
  onAskAi
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [fitFeedback, setFitFeedback] = useState<'True to size' | 'Runs small' | 'Runs large' | 'Oversized fit'>('True to size');
  const [reviewerName, setReviewerName] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [copiedTailorNotes, setCopiedTailorNotes] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<'Maxi Gown' | 'Boubou' | 'Two-Piece' | 'Corset Top' | 'Traditional Wrapper'>('Maxi Gown');

  const discountAmount = product.originalPriceNaira - product.priceNaira;
  const discountPercent = Math.round((discountAmount / product.originalPriceNaira) * 100);

  const handleCopyTailorNotes = () => {
    const text = `Stylemodiste Fabric Spec:\n- Product: ${product.title}\n- Yardage: ${product.fabricSpec?.yardsPerPiece || 6} Yards Full Cut\n- Fabric Type: ${product.fabricSpec?.fabricType || product.category}\n- Texture: ${product.fabricSpec?.texture || 'Premium Drape'}\n- Recommended Style: ${selectedStyle}\n- Brand: Stylemodiste (100% Original Quality Guarantee)`;
    navigator.clipboard.writeText(text);
    setCopiedTailorNotes(true);
    setTimeout(() => setCopiedTailorNotes(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddReview(product.id, {
      rating: newRating,
      comment: newComment,
      fitFeedback,
      userName: reviewerName || 'Lagos Thrifter'
    });

    setReviewSubmitted(true);
    setNewComment('');
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] sm:max-h-[92vh] flex flex-col my-auto border border-slate-100">
        
        {/* Header Close Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">• Item #{product.id}</span>
          </div>

          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 sm:space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8">
            
            {/* Left: Images Column */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                <span className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 font-bold text-xs px-3 py-1 rounded-xl shadow-sm border border-slate-700">
                  {product.condition}
                </span>

                <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md">
                  📍 {product.location}
                </span>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Buyer Protection Note */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Paystack Escrow Buyer Protection</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your funds are held securely until you inspect and confirm the thrift item upon delivery. 100% money-back guarantee if condition differs from listing.
                </p>
              </div>
            </div>

            {/* Right: Details Column */}
            <div className="md:col-span-6 space-y-5">
              
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h1>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-950">
                      ₦{product.priceNaira.toLocaleString()}
                    </span>
                    {product.originalPriceNaira > product.priceNaira && (
                      <span className="text-sm text-slate-400 line-through">
                        ₦{product.originalPriceNaira.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {discountPercent > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-lg">
                      Save ₦{discountAmount.toLocaleString()} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-700">
                <div>
                  <span className="text-stone-400 block font-medium">{product.fabricSpec ? 'Yards Length' : 'Size'}</span>
                  <span className="font-bold text-stone-900">{product.fabricSpec ? `${product.fabricSpec.yardsPerPiece} Yards` : product.size}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Category / Section</span>
                  <span className="font-bold text-emerald-900">{product.category} ({product.section === 'fabrics' ? 'Fabrics Section' : 'Thrift Section'})</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Condition Grade</span>
                  <span className="font-bold text-emerald-800">{product.condition}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Stock Status</span>
                  <span className="font-bold text-amber-700">
                    {product.stock > 0 ? `✨ ${product.stock} pieces available` : 'Sold Out'}
                  </span>
                </div>
              </div>

              {/* Fabric Specs & Interactive Tailor Yardage Estimator */}
              {product.fabricSpec ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-emerald-600" />
                      <span>Stylemodiste Tailor & Yardage Spec Sheet</span>
                    </h3>
                    <button
                      onClick={handleCopyTailorNotes}
                      className="text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedTailorNotes ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                      <span>{copiedTailorNotes ? 'Notes Copied!' : 'Copy Tailor Notes'}</span>
                    </button>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 text-xs space-y-3 text-emerald-950">
                    <div className="grid grid-cols-2 gap-2 pb-2 border-b border-emerald-200/60">
                      <div><strong>Fabric Type:</strong> {product.fabricSpec.fabricType}</div>
                      <div><strong>Full Yardage Cut:</strong> {product.fabricSpec.yardsPerPiece} Yards Piece</div>
                      <div><strong>Drape & Texture:</strong> {product.fabricSpec.texture || 'Smooth, rich drape'}</div>
                      <div><strong>Original Quality:</strong> 100% Guaranteed</div>
                    </div>

                    {/* Interactive Outfit Yardage Calculator */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-emerald-900 block text-[11px]">
                        ✂️ Select Your Desired Outfit Style for Tailoring Yards Check:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(['Maxi Gown', 'Boubou', 'Two-Piece', 'Corset Top', 'Traditional Wrapper'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                              selectedStyle === style
                                ? 'bg-emerald-800 text-amber-300 shadow-xs'
                                : 'bg-white/80 hover:bg-white text-emerald-900 border border-emerald-200'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-emerald-100/90 border border-emerald-300/80 rounded-xl p-2.5 text-[11px] text-emerald-950 flex items-center justify-between">
                      <span>
                        <strong>Requirement for {selectedStyle}:</strong> This {product.fabricSpec.yardsPerPiece}-yard piece provides ample fabric for a full {selectedStyle.toLowerCase()} with generous flair & matching gele/headwrap!
                      </span>
                      <span className="font-black text-emerald-900 shrink-0 ml-2">✓ Perfect Cut</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Item Condition & Inspection Report
                  </h3>
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 text-xs space-y-1.5 text-stone-800">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Material:</strong> {product.material || 'Premium Fabric / Wear'}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Inspection Note:</strong> {product.defectNotes || 'Excellent pre-loved condition.'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Seller Profile Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.storeName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-600"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-sm text-slate-900">{product.seller.storeName}</span>
                      {product.seller.bvnVerified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" title="BVN & NIN Verified" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                        {product.seller.rating} ({product.seller.totalReviews} reviews)
                      </span>
                      <span>•</span>
                      <span>{product.seller.city}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onAskAi(`Is this ${product.title} from ${product.seller.storeName} authentic and fair priced?`)}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ask AI</span>
                </button>
              </div>

              {/* Buy & Cart Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  id="modal-add-cart-btn"
                  disabled={product.stock <= 0}
                  onClick={() => onAddToCart(product)}
                  className="flex-1 py-3 min-h-[48px] bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="modal-instant-checkout-btn"
                  disabled={product.stock <= 0}
                  onClick={() => onInstantCheckout(product)}
                  className="flex-1 py-3 min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-emerald-900/20 disabled:opacity-50"
                >
                  <span>Buy Now (Paystack Escrow)</span>
                </button>
              </div>

            </div>

          </div>

          {/* Reviews & Trust Section */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Verified Buyer Reviews</h3>
                <p className="text-xs text-slate-500">Community trust feedback for this item and seller</p>
              </div>

              <button
                id="toggle-review-form-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                {showReviewForm ? 'Cancel Review' : '+ Write Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Submit Your Honest Feedback</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Adebisi from Lekki"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rating</label>
                    <div className="flex space-x-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Fit Feedback</label>
                  <select
                    value={fitFeedback}
                    onChange={(e: any) => setFitFeedback(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="True to size">True to size</option>
                    <option value="Runs small">Runs small</option>
                    <option value="Runs large">Runs large</option>
                    <option value="Oversized fit">Oversized fit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Review Comment</label>
                  <textarea
                    rows={2}
                    placeholder="How was the condition? Did it arrive fast via courier?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  ></textarea>
                </div>

                {reviewSubmitted ? (
                  <div className="p-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl text-center">
                    ✓ Review posted! Thank you for strengthening community trust.
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Post Verified Review
                  </button>
                )}
              </form>
            )}

            {/* Reviews List */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-3">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Fit: <strong>{rev.fitFeedback}</strong></span>
                      <span>{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
                No reviews yet for this specific item. Be the first to leave a review!
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
