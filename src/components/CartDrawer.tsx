import React from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.priceNaira * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span className="font-black text-sm">Your Okrika Bag ({cart.length})</span>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {cart.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-800 text-sm">Your Thrift Bag is Empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore Y2K denim, Nike kicks, and designer bag deals from verified Nigerian thrifters!
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex space-x-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 flex flex-col justify-between truncate">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-xs text-slate-900 truncate max-w-[170px]">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Size: {item.product.size} • {item.product.condition}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-black text-xs text-emerald-950">
                      ₦{(item.product.priceNaira * item.quantity).toLocaleString()}
                    </span>

                    <div className="flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-1 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-1 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-600">Subtotal</span>
              <span className="font-black text-emerald-950 text-base">₦{subtotal.toLocaleString()}</span>
            </div>

            <div className="bg-emerald-100 text-emerald-900 text-[11px] p-2.5 rounded-xl font-semibold flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Protected by Paystack Escrow Guarantee</span>
            </div>

            <button
              id="drawer-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3 min-h-[48px] bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl text-sm flex items-center justify-center space-x-2 shadow-md shadow-emerald-900/20 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
