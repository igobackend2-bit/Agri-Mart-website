import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { fetchOrderById } from '../dbHelper';
import { Order } from '../types';

interface OrderTrackingProps {
  setCurrentPage: (p: string) => void;
}

const STEPS = [
  { key: 'Placed', label: 'Order Placed', icon: Package, desc: 'We received your order' },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle, desc: 'Order confirmed by our team' },
  { key: 'Dispatched', label: 'Dispatched', icon: Truck, desc: 'Out for delivery to your farm' },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle, desc: 'Successfully delivered' },
];

const STATUS_ORDER = ['Placed', 'Confirmed', 'Dispatched', 'Delivered'];

export default function OrderTrackingComponent({ setCurrentPage }: OrderTrackingProps) {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) { setError('Please enter an Order ID.'); return; }
    setError('');
    setNotFound(false);
    setOrder(null);
    setLoading(true);
    try {
      const found = await fetchOrderById(orderId.trim());
      if (!found) {
        setNotFound(true);
      } else if (phone && found.phone && found.phone.replace(/\D/g,'').slice(-10) !== phone.replace(/\D/g,'').slice(-10)) {
        setError('Phone number does not match this order.');
      } else {
        setOrder(found);
      }
    } catch {
      setError('Could not fetch order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_ORDER.indexOf(order.status) : -1;
  const isCancelled = order?.status === 'Cancelled';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => setCurrentPage('home')} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1B6B3A] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-emerald-50 border-2 border-emerald-200 rounded-2xl mb-4">
          <Truck className="h-8 w-8 text-[#1B6B3A]" />
        </div>
        <h1 className="font-extrabold text-2xl text-slate-800">Track Your Order</h1>
        <p className="text-sm text-slate-400 mt-1">Enter your Order ID to see the latest status</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleTrack} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 mb-8">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Order ID *</label>
          <input
            type="text"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder="e.g. ord-abc123xyz"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#1B6B3A] transition"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Phone Number (optional, for verification)</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#1B6B3A] transition"
          />
        </div>
        {error && <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1B6B3A] hover:bg-[#15532d] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {loading ? (
            <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Tracking…</>
          ) : (
            <><Search className="h-4 w-4" /> Track Order</>
          )}
        </button>
      </form>

      {/* Not Found */}
      {notFound && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h3 className="font-extrabold text-red-700 mb-1">Order Not Found</h3>
          <p className="text-xs text-red-500">No order found with ID <span className="font-mono font-black">{orderId}</span>. Please check and try again.</p>
        </div>
      )}

      {/* Order Found */}
      {order && (
        <div className="space-y-5">
          {/* Order Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">Order #{order.id}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'Date not available'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                isCancelled ? 'bg-red-50 text-red-700 border-red-200' :
                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                order.status === 'Dispatched' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>{order.status}</span>
            </div>

            {/* Items */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Items Ordered</h4>
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="font-medium text-slate-700">{item.name} <span className="text-slate-400">×{item.quantity}</span></div>
                  <div className="font-bold text-slate-800">₹{item.price * item.quantity}</div>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-2 flex justify-between font-extrabold text-sm">
                <span className="text-slate-700">Total Paid</span>
                <span className="text-[#1B6B3A]">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="border-t border-slate-100 pt-4 mt-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Delivery Address</h4>
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-800">{order.deliveryAddress.name}</div>
                    <div>{order.deliveryAddress.addressLine1}{order.deliveryAddress.addressLine2 ? `, ${order.deliveryAddress.addressLine2}` : ''}</div>
                    <div>{order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}</div>
                  </div>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1.5">
                    <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{order.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tracking Stepper */}
          {!isCancelled && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h4 className="font-extrabold text-sm text-slate-800 mb-6">Order Progress</h4>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-100" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-[#1B6B3A] transition-all duration-700"
                  style={{ height: `${Math.max(0, (currentStep / (STEPS.length - 1)) * 100)}%` }}
                />

                <div className="space-y-6">
                  {STEPS.map((step, i) => {
                    const isCompleted = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <div key={step.key} className="flex items-start gap-4 relative">
                        <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                          isCompleted ? 'bg-[#1B6B3A] border-[#1B6B3A]' : 'bg-white border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}>
                          <step.icon className={`h-4 w-4 ${isCompleted ? 'text-white' : 'text-slate-300'}`} />
                        </div>
                        <div className="pt-1.5">
                          <div className={`text-sm font-extrabold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</div>
                          <div className={`text-xs mt-0.5 ${isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>{step.desc}</div>
                          {isCurrent && (
                            <span className="inline-block mt-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                              ← Current Status
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cancelled State */}
          {isCancelled && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
              <XCircle className="h-10 w-10 text-red-400 mx-auto mb-2" />
              <h3 className="font-extrabold text-red-700 mb-1">Order Cancelled</h3>
              <p className="text-xs text-red-500">This order has been cancelled. Refund (if applicable) will be processed within 5-7 business days.</p>
            </div>
          )}

          {/* Support */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-emerald-800">Need help with your order?</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">Our agri support team is available Mon-Sat, 9AM-6PM</p>
            </div>
            <a href="https://wa.me/917397785803" target="_blank" rel="noreferrer"
              className="bg-[#1B6B3A] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-800 transition whitespace-nowrap">
              WhatsApp Us
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
