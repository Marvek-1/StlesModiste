import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  ArrowRight, 
  Printer, 
  Download,
  AlertCircle
} from 'lucide-react';
import { CartItem, PaymentMethod, CourierProvider, DeliveryAddress, Order } from '../types';
import { NIGERIAN_STATES, COURIER_PROVIDERS } from '../data/mockData';

interface CheckoutModalProps {
  cart: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  onClose,
  onClearCart,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Address State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedState, setSelectedState] = useState('Lagos');
  const [selectedLga, setSelectedLga] = useState('Ikeja');
  const [streetAddress, setStreetAddress] = useState('');
  const [nearestLandmark, setNearestLandmark] = useState('');

  // Shipping & Payment State
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>('Bolt Delivery (Bolt Send)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.priceNaira * item.quantity, 0);
  const currentCourierObj = COURIER_PROVIDERS.find(c => c.name === selectedCourier) || COURIER_PROVIDERS[0];
  const deliveryFee = selectedState === 'Lagos' ? currentCourierObj.priceLagos : currentCourierObj.priceInterstate;
  const totalAmount = subtotal + deliveryFee;

  const currentLgas = NIGERIAN_STATES.find(s => s.name === selectedState)?.lgas || ['Central LGA'];

  // Handle State Change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateObj = NIGERIAN_STATES.find(s => s.name === stateName);
    if (stateObj && stateObj.lgas.length > 0) {
      setSelectedLga(stateObj.lgas[0]);
    }
  };

  // Submit Order to Server API
  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !phone.trim() || !streetAddress.trim()) {
      alert('Please fill in your name, phone number, and delivery street address.');
      return;
    }

    setIsProcessing(true);

    const deliveryAddressObj: DeliveryAddress = {
      fullName,
      phone,
      email: email || 'buyer@okrikaexpress.ng',
      state: selectedState,
      lga: selectedLga,
      streetAddress,
      nearestLandmark
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          subtotalNaira: subtotal,
          deliveryFeeNaira: deliveryFee,
          totalNaira: totalAmount,
          paymentMethod,
          deliveryAddress: deliveryAddressObj,
          courier: selectedCourier
        })
      });

      const data = await res.json();

      if (data.success && data.order) {
        setCompletedOrder(data.order);
        onOrderSuccess(data.order);
        onClearCart();
        setStep('confirmation');
      } else {
        alert(data.error || 'Failed to place order.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while processing order.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] sm:max-h-[92vh] flex flex-col my-auto border border-slate-100">
        
        {/* Modal Top Navigation */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md">
              Secure Checkout
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              • Paystack Escrow Protection Active
            </span>
          </div>

          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          
          {/* STEP 1 & 2: ADDRESS, COURIER & PAYMENT */}
          {step !== 'confirmation' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Form Details */}
              <div className="md:col-span-7 space-y-5">
                
                {/* Step Toggle Headers */}
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setStep('details')}
                    className={`pb-2 pr-4 text-xs font-bold transition-all ${
                      step === 'details' ? 'border-b-2 border-emerald-600 text-emerald-800' : 'text-slate-400'
                    }`}
                  >
                    1. Address & Courier
                  </button>
                  <button
                    onClick={() => setStep('payment')}
                    className={`pb-2 px-4 text-xs font-bold transition-all ${
                      step === 'payment' ? 'border-b-2 border-emerald-600 text-emerald-800' : 'text-slate-400'
                    }`}
                  >
                    2. Payment Method
                  </button>
                </div>

                {step === 'details' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Delivery Address in Nigeria
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Babatunde Lawal"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp Phone *</label>
                        <input
                          type="tel"
                          placeholder="+234 803 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">State *</label>
                        <select
                          value={selectedState}
                          onChange={(e) => handleStateChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {NIGERIAN_STATES.map(st => (
                            <option key={st.name} value={st.name}>{st.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">LGA / Area *</label>
                        <select
                          value={selectedLga}
                          onChange={(e) => setSelectedLga(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {currentLgas.map(lga => (
                            <option key={lga} value={lga}>{lga}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Street Address *</label>
                      <input
                        type="text"
                        placeholder="House / Flat Number, Street Name"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Courier Provider Selection */}
                    <div className="pt-2 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>Select Delivery Courier</span>
                      </h4>

                      <div className="space-y-2">
                        {COURIER_PROVIDERS.map((c) => {
                          const isSelected = selectedCourier === c.name;
                          const price = selectedState === 'Lagos' ? c.priceLagos : c.priceInterstate;
                          return (
                            <div
                              key={c.id}
                              onClick={() => setSelectedCourier(c.name)}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-500'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-xs text-slate-900">{c.name}</span>
                                  <span className="bg-emerald-200 text-emerald-900 text-[9px] font-black px-1.5 py-0.5 rounded">
                                    {c.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500">{c.description} ({c.time})</p>
                              </div>
                              <span className="font-black text-xs text-emerald-950 shrink-0">
                                ₦{price.toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!fullName || !phone || !streetAddress) {
                          alert('Please complete all address fields.');
                          return;
                        }
                        setStep('payment');
                      }}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </div>
                )}

                {step === 'payment' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment Gateway (Paystack Escrow)
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMethod('paystack_card')}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          paymentMethod === 'paystack_card'
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600 mb-1" />
                        <span className="block font-bold text-xs text-slate-900">Paystack Card</span>
                        <span className="text-[10px] text-slate-500">Mastercard, Visa, Verve</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          paymentMethod === 'bank_transfer'
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-amber-600 mb-1" />
                        <span className="block font-bold text-xs text-slate-900">Bank Transfer</span>
                        <span className="text-[10px] text-slate-500">Instant Virtual Account</span>
                      </button>
                    </div>

                    {/* Bank Transfer Simulated Box */}
                    {paymentMethod === 'bank_transfer' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
                        <p className="font-bold text-amber-900">Virtual Escrow Account Details:</p>
                        <div className="bg-white p-3 rounded-xl border border-amber-200/80 space-y-1 font-mono text-slate-800">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Bank:</span>
                            <span className="font-bold">Wema Bank / Paystack Titan</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Account No:</span>
                            <span className="font-bold text-amber-800 tracking-wider">9920 8492 11</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Account Name:</span>
                            <span className="font-bold">OkrikaExpress Escrow Vault</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Transfer ₦{totalAmount.toLocaleString()} to complete escrow deposit.
                        </p>
                      </div>
                    )}

                    {/* Paystack Escrow Guarantee */}
                    <div className="bg-slate-900 text-white rounded-2xl p-4 text-xs space-y-2">
                      <div className="flex items-center space-x-2 text-amber-300 font-bold">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>How OkrikaExpress Escrow Works</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        1. Payment is locked securely in escrow.<br />
                        2. Seller ships Grade A item via {selectedCourier}.<br />
                        3. You inspect package upon delivery.<br />
                        4. Funds are released to seller only after your approval!
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => setStep('details')}
                        className="py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
                      >
                        Back
                      </button>

                      <button
                        id="paystack-submit-btn"
                        disabled={isProcessing}
                        onClick={handlePlaceOrder}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-emerald-900/20 disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <span>Processing Escrow Payment...</span>
                        ) : (
                          <span>Pay ₦{totalAmount.toLocaleString()} Now</span>
                        )}
                      </button>
                    </div>

                  </div>
                )}

              </div>

              {/* Right Column: Order Summary */}
              <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Cart Summary ({cart.length} items)
                </h3>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex space-x-3 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 truncate">
                        <p className="font-bold text-slate-900 truncate">{item.product.title}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity} • {item.product.condition}</p>
                        <p className="font-black text-emerald-800 text-xs mt-0.5">
                          ₦{(item.product.priceNaira * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery ({selectedCourier})</span>
                    <span>₦{deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-emerald-950 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION & WAYBILL RECEIPT */}
          {step === 'confirmation' && completedOrder && (
            <div className="py-6 text-center space-y-6">
              
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900">Order & Escrow Secured!</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your payment of <strong className="text-emerald-800">₦{completedOrder.totalNaira.toLocaleString()}</strong> has been locked in Paystack Escrow.
                </p>
              </div>

              {/* Waybill Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 max-w-md mx-auto space-y-4 text-left border border-slate-800 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">WAYBILL NUMBER</span>
                    <span className="text-lg font-black tracking-wider text-white">{completedOrder.waybillNumber}</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {completedOrder.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Courier</span>
                    <span className="font-bold">{completedOrder.courier}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Payment Ref</span>
                    <span className="font-bold truncate block">{completedOrder.paymentReference}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Delivery To</span>
                    <span className="font-bold">{completedOrder.deliveryAddress.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Location</span>
                    <span className="font-bold">{completedOrder.deliveryAddress.lga}, {completedOrder.deliveryAddress.state}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Arrival:</span>
                  <span className="font-bold text-amber-300">{completedOrder.estimatedDelivery}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="print-waybill-btn"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Waybill Receipt</span>
                </button>

                <button
                  id="finish-checkout-btn"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm"
                >
                  Return to Marketplace
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
