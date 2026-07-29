import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  PackageCheck, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  ShoppingBag, 
  FileText, 
  Scissors, 
  Shirt, 
  Phone, 
  MapPin, 
  CreditCard,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Order, CartItem } from '../types';

interface OrderHistoryModalProps {
  onClose: () => void;
  onTrackOrder: (waybillNumber: string) => void;
  onReorder: (items: CartItem[]) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  onClose,
  onTrackOrder,
  onReorder
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'fabrics' | 'thrift'>('all');
  const [copiedWaybill, setCopiedWaybill] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load past orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopyWaybill = (waybill: string) => {
    navigator.clipboard.writeText(waybill);
    setCopiedWaybill(waybill);
    setTimeout(() => setCopiedWaybill(null), 2500);
  };

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirmingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        setActionSuccessMessage(`Order #${data.order.waybillNumber} confirmed! Escrow funds released to merchant.`);
        setTimeout(() => setActionSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Error confirming delivery:', err);
    } finally {
      setConfirmingOrderId(null);
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    // Search query match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.waybillNumber.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.deliveryAddress.fullName.toLowerCase().includes(query) ||
      order.courier.toLowerCase().includes(query) ||
      order.items.some((it) => it.product.title.toLowerCase().includes(query));

    // Status filter match
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && (order.status === 'In Transit' || order.status === 'Out for Delivery' || order.status === 'Order Placed')) ||
      (statusFilter === 'Delivered' && (order.status === 'Delivered' || order.status === 'Buyer Confirmed')) ||
      order.status === statusFilter;

    // Section filter match
    const matchesSection =
      sectionFilter === 'all' ||
      (sectionFilter === 'fabrics' && order.items.some((it) => it.product.section === 'fabrics')) ||
      (sectionFilter === 'thrift' && order.items.some((it) => it.product.section === 'thrift'));

    return matchesSearch && matchesStatus && matchesSection;
  });

  // Calculate totals
  const totalSpentNaira = orders.reduce((sum, o) => sum + o.totalNaira, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Buyer Confirmed' && o.status !== 'Delivered').length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Buyer Confirmed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Delivered':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'Out for Delivery':
        return 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse';
      case 'In Transit':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Dropped at Hub':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col my-auto border border-slate-200">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-stone-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-800 text-amber-300 rounded-2xl border border-emerald-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Stylemodiste Order History</h2>
                <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {orders.length} Purchases
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-medium hidden sm:block">
                Track past fabric yardages, thrift grails, escrow payment receipts & courier delivery updates.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="refresh-orders-btn"
              onClick={fetchOrders}
              className="p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-all cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-300' : ''}`} />
            </button>
            <button
              id="close-order-history-modal-btn"
              onClick={onClose}
              className="p-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-stone-50 flex-1">

          {actionSuccessMessage && (
            <div className="bg-emerald-900 text-emerald-100 p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between border border-emerald-700 shadow-sm animate-fade-in">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{actionSuccessMessage}</span>
              </div>
              <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Orders</span>
              <span className="text-lg font-black text-slate-900">{orders.length}</span>
              <span className="text-[10px] text-slate-500 block">Verified Purchases</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">In Transit / Active</span>
              <span className="text-lg font-black text-amber-900">{activeOrdersCount}</span>
              <span className="text-[10px] text-amber-600 block">En-route via Courier</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Order Volume</span>
              <span className="text-lg font-black text-emerald-950">₦{totalSpentNaira.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-700 block">Paystack Escrow Protected</span>
            </div>

            <div className="bg-emerald-950 text-white p-3.5 rounded-2xl border border-emerald-800 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center space-x-1 text-amber-300 text-xs font-black">
                <ShieldCheck className="w-4 h-4" />
                <span>Escrow Shield</span>
              </div>
              <p className="text-[10px] text-emerald-200 leading-tight">
                Funds released to sellers only after you confirm delivery.
              </p>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="order-history-search-input"
                  type="text"
                  placeholder="Search by Waybill #, Item name, Recipient or Courier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  id="order-status-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Shipments</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Buyer Confirmed">Buyer Confirmed</option>
                </select>
              </div>

            </div>

            {/* Section Filter Pills */}
            <div className="flex items-center space-x-2 text-xs font-bold pt-1 border-t border-slate-100">
              <span className="text-slate-500 text-[11px]">Filter Category:</span>
              <button
                onClick={() => setSectionFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  sectionFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Purchases
              </button>
              <button
                onClick={() => setSectionFilter('fabrics')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${
                  sectionFilter === 'fabrics'
                    ? 'bg-emerald-800 text-amber-300'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700'
                }`}
              >
                <Scissors className="w-3 h-3" />
                <span>Section 1 Fabrics</span>
              </button>
              <button
                onClick={() => setSectionFilter('thrift')}
                className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all cursor-pointer ${
                  sectionFilter === 'thrift'
                    ? 'bg-emerald-800 text-amber-300'
                    : 'bg-slate-100 hover:bg-amber-50 text-slate-700'
                }`}
              >
                <Shirt className="w-3 h-3" />
                <span>Section 2 Thrift</span>
              </button>
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Retrieving your past orders and courier waybill updates...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden hover:border-slate-300 transition-all"
                >
                  {/* Card Header Bar */}
                  <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3">
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {/* Waybill Code Badge */}
                      <div className="flex items-center bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                        <Truck className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
                        <span className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                          #{order.waybillNumber}
                        </span>
                        <button
                          onClick={() => handleCopyWaybill(order.waybillNumber)}
                          className="ml-2 text-slate-400 hover:text-white transition-colors"
                          title="Copy Waybill"
                        >
                          {copiedWaybill === order.waybillNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        Placed: <strong className="text-slate-200">{order.createdAt}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 sm:p-5 space-y-4">

                    {/* Order Items List */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3.5 bg-stone-50 p-3 rounded-2xl border border-stone-200/70"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                item.product.section === 'fabrics' 
                                  ? 'bg-emerald-800 text-amber-300' 
                                  : 'bg-slate-800 text-amber-300'
                              }`}>
                                {item.product.section === 'fabrics' ? 'Section 1 Fabric' : 'Section 2 Thrift'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold">
                                {item.product.condition}
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {item.product.title}
                            </h4>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                              <span>Size / Spec: <strong className="text-slate-900 font-bold">{item.product.size}</strong></span>
                              <span>•</span>
                              <span>Qty: <strong className="text-slate-900 font-bold">{item.quantity}</strong></span>
                              <span>•</span>
                              <span>Merchant: <strong className="text-emerald-900 font-bold">{item.product.seller?.storeName || 'Stylemodiste Store'}</strong></span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-black text-slate-900 block">
                              ₦{(item.product.priceNaira * item.quantity).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              ₦{item.product.priceNaira.toLocaleString()} ea
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details & Delivery Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                      
                      {/* Delivery Address & Courier info */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Destination Address:</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                            {order.courier}
                          </span>
                        </div>

                        <p className="font-bold text-slate-800">
                          {order.deliveryAddress.fullName} ({order.deliveryAddress.phone})
                        </p>
                        <p className="text-slate-600 leading-snug">
                          {order.deliveryAddress.streetAddress}, {order.deliveryAddress.lga}, {order.deliveryAddress.state} State.
                        </p>
                        {order.deliveryAddress.nearestLandmark && (
                          <p className="text-[11px] text-slate-500 italic">
                            Landmark: {order.deliveryAddress.nearestLandmark}
                          </p>
                        )}
                      </div>

                      {/* Payment & Financial Summary */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-slate-700 mb-1">
                            <span>Items Subtotal:</span>
                            <span className="font-bold text-slate-900">₦{order.subtotalNaira.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-700 mb-1">
                            <span>Doorstep Delivery ({order.courier}):</span>
                            <span className="font-bold text-slate-900">₦{order.deliveryFeeNaira.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                            <span>Total Paid:</span>
                            <span className="text-emerald-800 font-extrabold">₦{order.totalNaira.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                          <span className="flex items-center gap-1 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Paystack Escrow Ref: {order.paymentReference}</span>
                          </span>
                          <span className="font-extrabold text-emerald-800">Secured ✓</span>
                        </div>
                      </div>

                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Track Delivery Button */}
                        <button
                          id={`btn-track-order-${order.id}`}
                          onClick={() => onTrackOrder(order.waybillNumber)}
                          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                        >
                          <Truck className="w-4 h-4 text-amber-400" />
                          <span>Track Live Delivery</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        {/* View Invoice Button */}
                        <button
                          id={`btn-view-invoice-${order.id}`}
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-600" />
                          <span>View Receipt</span>
                        </button>

                        {/* Reorder Button */}
                        <button
                          id={`btn-reorder-${order.id}`}
                          onClick={() => onReorder(order.items)}
                          className="px-3 py-2 bg-slate-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center space-x-1 transition-all cursor-pointer"
                          title="Add items to cart again"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Buy Again</span>
                        </button>
                      </div>

                      {/* Confirm Escrow Release Button */}
                      {order.status !== 'Buyer Confirmed' && (
                        <button
                          id={`btn-confirm-escrow-${order.id}`}
                          onClick={() => handleConfirmDelivery(order.id)}
                          disabled={confirmingOrderId === order.id}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4 text-stone-950" />
                          <span>
                            {confirmingOrderId === order.id ? 'Confirming...' : 'Confirm Received & Release Funds'}
                          </span>
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200/80 shadow-xs">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No Past Purchases Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No order records matched your query or filter. Explore Section 1 Quality Fabrics or Section 2 Thrift Wears to place your first escrow-protected order!
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setSectionFilter('all');
                }}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Clear Search & Filters
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Invoice / Receipt Detail Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-800 text-amber-300 rounded-xl">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Stylemodiste Brand Escrow Receipt</h3>
                  <p className="text-[11px] text-slate-500 font-bold">Official Proof of Payment & Order Voucher</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Waybill Ref:</span>
                <span className="font-mono font-bold text-slate-900">#{selectedInvoiceOrder.waybillNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Paystack Escrow Ref:</span>
                <span className="font-mono text-emerald-800 font-bold">{selectedInvoiceOrder.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Customer Name:</span>
                <span className="font-bold text-slate-900">{selectedInvoiceOrder.deliveryAddress.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-bold">Logistics Courier:</span>
                <span className="font-bold text-slate-900">{selectedInvoiceOrder.courier}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-black text-sm">
                <span className="text-slate-900">Total Paid:</span>
                <span className="text-emerald-900">₦{selectedInvoiceOrder.totalNaira.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
