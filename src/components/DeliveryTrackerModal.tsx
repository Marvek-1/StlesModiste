import React, { useState } from 'react';
import { X, Search, Truck, MapPin, CheckCircle2, Clock, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface DeliveryTrackerModalProps {
  onClose: () => void;
  initialWaybill?: string;
}

export const DeliveryTrackerModal: React.FC<DeliveryTrackerModalProps> = ({
  onClose,
  initialWaybill = 'GIGL-LOS-ABJ-99201'
}) => {
  const [waybillInput, setWaybillInput] = useState(initialWaybill);
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrackSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!waybillInput.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(waybillInput.trim())}`);
      const data = await res.json();

      if (data.success && data.order) {
        setSearchedOrder(data.order);
      } else {
        setErrorMessage('Waybill reference not found. Try searching GIGL-LOS-ABJ-99201');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to connect to courier tracking server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial auto search on open
  React.useEffect(() => {
    handleTrackSearch();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto border border-slate-100">
        
        {/* Top Bar */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">Localized Courier Waybill Tracker</span>
          </div>

          <button
            id="close-tracker-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Bar */}
          <form onSubmit={handleTrackSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                id="waybill-search-input"
                type="text"
                placeholder="Enter Waybill or Tracking Number (e.g. BOLT-LOS-88291 or GIGL-LOS-ABJ-99201)"
                value={waybillInput}
                onChange={(e) => setWaybillInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              id="submit-waybill-search-btn"
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Track Package'}
            </button>
          </form>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-2xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Searched Order Tracking Card */}
          {searchedOrder && (
            <div className="space-y-6">
              
              {/* Status Header */}
              <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-5 shadow-md flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block">WAYBILL CODE</span>
                  <span className="text-lg font-black text-white">{searchedOrder.waybillNumber}</span>
                  <p className="text-xs text-slate-300 mt-1">
                    Courier: <strong>{searchedOrder.courier}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-emerald-500/20 text-emerald-300 font-black text-xs px-3 py-1 rounded-xl border border-emerald-500/30">
                    Status: {searchedOrder.status || 'In Transit'}
                  </span>
                  <span className="block text-[11px] text-slate-300 mt-1">
                    ETA: {searchedOrder.estimatedDelivery || 'Within 24 Hours'}
                  </span>
                </div>
              </div>

              {/* Delivery Contact & Escrow Protection Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dispatch Courier Helpline</span>
                    <span className="font-bold text-slate-900">{searchedOrder.courierPhone || '+234 800 444 5645'}</span>
                  </div>
                  <a
                    href={`tel:${searchedOrder.courierPhone || '08004445645'}`}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center space-x-2 text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block text-[11px]">Paystack Escrow Deposit Active</span>
                    <span className="text-[10px] text-emerald-800">Funds remain locked until you confirm delivery.</span>
                  </div>
                </div>
              </div>

              {/* Step By Step Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Real-Time Courier Waybill Timeline
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {searchedOrder.trackingSteps?.map((step: any, idx: number) => (
                    <div key={idx} className="relative space-y-1">
                      {/* Step Dot */}
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                        step.completed 
                          ? 'bg-emerald-600 ring-4 ring-emerald-100' 
                          : step.current 
                          ? 'bg-amber-500 ring-4 ring-amber-100 animate-pulse' 
                          : 'bg-slate-300'
                      }`}>
                        {step.completed ? '✓' : idx + 1}
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{step.timestamp}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>Location: {step.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
