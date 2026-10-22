import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle2, Truck, MapPin, ExternalLink, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { Order, OrderStage } from '../types';
import { formatPKR } from '../utils/emailTemplates';

interface CustomerPortalProps {
  orders: Order[];
  selectedOrderId?: string;
  onOpenStorefront: () => void;
  onViewEmailsForOrder: (order: Order) => void;
}

const STAGES: { key: OrderStage; label: string; description: string; srsStage: string }[] = [
  {
    key: 'PAYMENT_PENDING',
    srsStage: 'Stage 1: Received',
    label: 'Payment Pending',
    description: 'Order recorded. Awaiting payment receipt verification for IBFT / Wallets.'
  },
  {
    key: 'PROCESSING',
    srsStage: 'Stage 2: Verified',
    label: 'Processing in Warehouse',
    description: 'Payment confirmed by Admin. Order passed to warehouse/inventory for packing.'
  },
  {
    key: 'SHIPPED',
    srsStage: 'Stage 3: Dispatched',
    label: 'Dispatched with Courier',
    description: 'Courier booking created (TCS / Leopard / Trax). Tracking ID attached.'
  },
  {
    key: 'DELIVERED',
    srsStage: 'Stage 4: Complete',
    label: 'Delivered',
    description: 'Courier confirms package delivery to customer shipping address.'
  }
];

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  orders,
  selectedOrderId,
  onOpenStorefront,
  onViewEmailsForOrder
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedOrderId || (orders[0]?.id ?? ''));

  const currentOrder = orders.find(
    (o) => o.id.toLowerCase() === searchQuery.trim().toLowerCase()
  ) || orders[0];

  const getStageIndex = (stage: OrderStage): number => {
    switch (stage) {
      case 'PAYMENT_PENDING':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
    }
  };

  const currentStageIndex = currentOrder ? getStageIndex(currentOrder.stage) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header banner */}
      <div className="bg-stone-900 text-stone-100 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
            Customer Portal & Fulfillment Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white mt-1">
            Order Shipping & Logistics Lifecycle
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-xl">
            Track orders across standard Pakistani courier workflows with TCS, Leopards, Trax, and PostEx.
          </p>
        </div>

        {/* Quick Order Lookup Form */}
        <div className="w-full md:w-auto">
          <label className="block text-[11px] uppercase tracking-wider text-stone-400 mb-1 font-medium">
            Search Order Number
          </label>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. PK-829104"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-stone-800 border border-stone-700 rounded text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Quick Selector Bar */}
      <div className="bg-white border border-stone-200 rounded-lg p-4">
        <div className="text-xs font-semibold text-stone-700 uppercase tracking-wide mb-3 flex items-center justify-between">
          <span>Recent Customer Orders ({orders.length})</span>
          <span className="text-[11px] text-stone-500 font-normal">Click any order to inspect</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {orders.map((order) => {
            const isSelected = currentOrder && currentOrder.id === order.id;
            return (
              <button
                key={order.id}
                onClick={() => setSearchQuery(order.id)}
                className={`p-3 rounded border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-1 ring-amber-500'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-xs text-stone-900">
                    #{order.id}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                    {order.stage.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-stone-600 truncate mt-1">
                  {order.customer.fullName} · {order.customer.city}
                </div>
                <div className="text-xs font-mono font-bold text-stone-900 mt-1">
                  {formatPKR(order.totalPKR)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Order View */}
      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column: 4-Stage Lifecycle & Items */}
          <div className="lg:col-span-8 space-y-6">
            {/* SRS Section 6 Fulfillment Stage Visualizer */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-xs font-mono text-stone-500">
                    Order Ref: #{currentOrder.id}
                  </span>
                  <h2 className="text-lg font-bold text-stone-900">
                    Logistics Fulfillment Progress
                  </h2>
                </div>
                <div className="text-xs text-stone-500">
                  Placed on: {new Date(currentOrder.createdAt).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* 4 Steps timeline */}
              <div className="relative">
                <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-stone-200 -z-0" />
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                  {STAGES.map((stageItem, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                      <div key={stageItem.key} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2">
                        {/* Step circle */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-xs ${
                            isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 text-stone-400 border border-stone-300'
                          }`}
                        >
                          {index < currentStageIndex ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isCurrent ? (
                            <span className="font-mono">{index + 1}</span>
                          ) : (
                            <span className="font-mono">{index + 1}</span>
                          )}
                        </div>

                        {/* Step copy */}
                        <div className="sm:text-center space-y-0.5">
                          <div className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">
                            {stageItem.srsStage}
                          </div>
                          <div className={`text-xs font-bold ${isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                            {stageItem.label}
                          </div>
                          <p className="text-[11px] text-stone-500 leading-tight hidden sm:block">
                            {stageItem.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active stage details banner */}
              <div className="bg-stone-50 border border-stone-200 rounded p-4 text-xs space-y-2">
                <div className="font-semibold text-stone-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Current Status: {STAGES[currentStageIndex]?.label}</span>
                </div>
                <p className="text-stone-600">
                  {STAGES[currentStageIndex]?.description}
                </p>

                {currentOrder.courier && (
                  <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Courier Carrier:</span>
                      <strong className="text-stone-900">{currentOrder.courier.carrier} Express</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Consignment Tracking ID:</span>
                      <strong className="font-mono text-emerald-700">{currentOrder.courier.trackingId}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Est. Arrival:</span>
                      <strong className="text-stone-900">{currentOrder.courier.estimatedDelivery}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Line Items list */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-2">
                Package Contents
              </h3>
              <div className="divide-y divide-stone-100">
                {currentOrder.items.map((item) => (
                  <div key={item.product.id} className="py-3 flex gap-4 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover rounded border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {item.product.title}
                      </h4>
                      <div className="text-xs text-stone-500">
                        {item.product.origin} · SKU: {item.product.sku}
                      </div>
                      <div className="text-xs text-stone-600 mt-0.5">
                        Quantity: <strong>{item.quantity}</strong>
                      </div>
                    </div>
                    <div className="text-sm font-mono font-bold text-stone-900 tabular-nums">
                      {formatPKR(item.product.pricePKR * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Customer, Payment, Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Delivery Destination */}
            <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-3 shadow-xs text-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Delivery Address</span>
              </div>
              <div>
                <strong className="text-stone-900 block text-sm">{currentOrder.customer.fullName}</strong>
                <span className="text-stone-500 block">{currentOrder.customer.phone}</span>
                <span className="text-stone-500 block">{currentOrder.customer.email}</span>
              </div>
              <p className="text-stone-700 pt-1 border-t border-stone-100">
                {currentOrder.customer.streetAddress}, {currentOrder.customer.city} ({currentOrder.customer.postalCode})
              </p>
              {currentOrder.customer.orderNotes && (
                <div className="p-2 bg-stone-50 rounded text-stone-600 italic">
                  Note: "{currentOrder.customer.orderNotes}"
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-3 shadow-xs text-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Payment Summary</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Method:</span>
                  <span className="font-semibold uppercase text-stone-800">{currentOrder.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Transaction ID:</span>
                  <span className="font-mono text-stone-800">{currentOrder.payment.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Verification Status:</span>
                  <span className="font-semibold text-emerald-700">
                    {currentOrder.stage === 'PAYMENT_PENDING' ? 'Pending Review' : 'Verified'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 font-bold text-sm">
                  <span>Grand Total:</span>
                  <span className="font-mono text-amber-800">{formatPKR(currentOrder.totalPKR)}</span>
                </div>
              </div>
            </div>

            {/* Support & Actions */}
            <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-stone-900">Need Immediate Help?</h4>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Our support team is available on WhatsApp from 9:00 AM to 9:00 PM (PKT) for instant order assistance.
              </p>
              <a
                href={`https://wa.me/923458821900?text=Salam%20Khaas,%20help%20with%20Order%20${currentOrder.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Direct WhatsApp Inquiry</span>
              </a>

              <button
                onClick={() => onViewEmailsForOrder(currentOrder)}
                className="w-full py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 font-medium rounded border border-stone-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Dispatched Transactional Emails</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-stone-200 space-y-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No Orders Found</h3>
          <p className="text-xs text-stone-500">No order matches query "{searchQuery}".</p>
          <button
            onClick={onOpenStorefront}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      )}
    </div>
  );
};
