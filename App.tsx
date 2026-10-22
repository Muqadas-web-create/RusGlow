/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { CustomerPortal } from './components/CustomerPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { PrintablePackingSlip } from './components/PrintablePackingSlip';
import { EmailSimulatorModal } from './components/EmailSimulatorModal';
import { SRSComplianceModal } from './components/SRSComplianceModal';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/initialData';
import { CartItem, CourierCarrier, Order, OrderStage, Product } from './types';
import { formatPKR } from './utils/emailTemplates';
import { ShieldCheck, Truck, RefreshCw, MessageSquare, Heart, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation View: 'storefront' | 'tracking' | 'admin' | 'emails'
  const [activeView, setActiveView] = useState<'storefront' | 'tracking' | 'admin' | 'emails'>('storefront');

  // Products
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rusglow_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // Default 1 item in cart to make experience instant and fun
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rusglow_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Selected Order for Tracking or Emails
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0]?.id ?? '');

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [packingSlipOrder, setPackingSlipOrder] = useState<Order | null>(null);
  const [emailViewerOrder, setEmailViewerOrder] = useState<Order | null>(null);
  const [isSRSModalOpen, setIsSRSModalOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('rusglow_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rusglow_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1500);
    showToast(`Added "${product.title}" to your shopping bag.`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
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

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setLastPlacedOrder(newOrder);
    setSelectedOrderId(newOrder.id);
    showToast(`Order #${newOrder.id} placed! Dual transactional emails dispatched.`);
  };

  // Admin update order stage
  const handleUpdateOrderStage = (
    orderId: string,
    newStage: OrderStage,
    courierInfo?: { carrier: CourierCarrier; trackingId: string }
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: Order = {
            ...o,
            stage: newStage
          };
          if (courierInfo) {
            updated.courier = {
              carrier: courierInfo.carrier,
              trackingId: courierInfo.trackingId,
              dispatchedAt: new Date().toISOString(),
              estimatedDelivery: '2-3 Business Days'
            };
          }
          return updated;
        }
        return o;
      })
    );
    showToast(`Order #${orderId} moved to stage: ${newStage.replace('_', ' ')}`);
  };

  const categories = ['All', 'Skincare'];
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs px-4 py-3 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenSRSModal={() => setIsSRSModalOpen(true)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeView === 'storefront' && (
          <div>
            {/* Hero Section */}
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onTrackClick={() => setActiveView('tracking')}
            />

            {/* Product Catalog Section */}
            <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              {/* Category Segmented Controls adhering to anti-slop guidelines */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5 mb-8">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-amber-800">
                    Curated Collection
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif-display font-medium text-stone-900 mt-1">
                    Master Artisan Creations
                  </h2>
                </div>

                {/* Filter controls */}
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg self-start sm:self-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={(p) => setActiveProductModal(p)}
                    isAdded={recentlyAddedId === product.id}
                  />
                ))}
              </div>

              {/* Craftsmanship & Trust narrative (SRS Section 1 & Section 7) */}
              <div className="mt-16 bg-stone-900 text-stone-100 rounded-xl p-8 sm:p-12 border border-stone-800">
                <div className="max-w-3xl space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Direct Artisan Traceability
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
                    Every piece preserves a centuries-old Pakistani tradition
                  </h3>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    We eliminate intermediate trading markups, ensuring handmade, organic skincare reaches you fresh and directly from Ru's Organics, with guaranteed nationwide courier delivery.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-stone-800 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-amber-200">100% Verified Authentic</div>
                    <p className="text-stone-400 leading-snug">
                      Each piece bears the signature seal of its respective regional artisan guild.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-amber-200">Local Gateways (EasyPaisa / JazzCash)</div>
                    <p className="text-stone-400 leading-snug">
                      Fast, frictionless payments via your existing mobile wallet without international surcharges.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-amber-200">Standard 7-Day Exchange</div>
                    <p className="text-stone-400 leading-snug">
                      Hassle-free nationwide size exchange for footwear and shawls through our courier partners.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tracking View */}
        {activeView === 'tracking' && (
          <CustomerPortal
            orders={orders}
            selectedOrderId={selectedOrderId}
            onOpenStorefront={() => setActiveView('storefront')}
            onViewEmailsForOrder={(order) => setEmailViewerOrder(order)}
          />
        )}

        {/* Store Admin & Logistics View */}
        {activeView === 'admin' && (
          <AdminDashboard
            orders={orders}
            onUpdateOrderStage={handleUpdateOrderStage}
            onOpenPackingSlip={(order) => setPackingSlipOrder(order)}
            onOpenEmails={(order) => setEmailViewerOrder(order)}
          />
        )}

        {/* Dual Email Engine Hub */}
        {activeView === 'emails' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-stone-900 text-stone-100 rounded-lg p-6 border border-stone-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                  SRS Section 5 Specification
                </span>
                <h1 className="text-2xl font-serif-display font-medium text-white mt-1">
                  Dual Automated Transactional Email Engine
                </h1>
                <p className="text-xs text-stone-300 mt-1">
                  Upon order placement, the mail server simultaneously dispatches two distinct HTML emails: Customer Receipt & Admin Alert.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsSRSModalOpen(true)}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-semibold border border-stone-700 cursor-pointer"
                >
                  View SRS Rules
                </button>
              </div>
            </div>

            {/* Orders list to inspect emails */}
            <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                Select an Order to Inspect its Dispatched Emails:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-50/50 transition-colors space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-sm text-stone-900">
                        #{order.id}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                        {order.stage.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-0.5">
                      <div>Customer: <strong>{order.customer.fullName}</strong></div>
                      <div>Total: <strong>{formatPKR(order.totalPKR)}</strong> ({order.payment.method.toUpperCase()})</div>
                    </div>

                    <button
                      onClick={() => setEmailViewerOrder(order)}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Preview Dual Emails</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-xl font-serif-display font-bold text-white tracking-tight">
                KHAAS PAKISTAN
              </span>
              <p className="text-stone-400 text-xs mt-1 max-w-sm">
                Localized Pakistani e-commerce platform with automated EasyPaisa, JazzCash, IBFT, dual email alerts, and multi-stage courier fulfillment.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-stone-300">
              <button
                onClick={() => setActiveView('storefront')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Storefront
              </button>
              <button
                onClick={() => setActiveView('tracking')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Track Shipment
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Admin Panel
              </button>
              <button
                onClick={() => setActiveView('emails')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Email Alerts Engine
              </button>
              <button
                onClick={() => setIsSRSModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                SRS Verification
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-stone-500">
            <div>
              © 2026 Khaas Lifestyle Pakistan Pvt Ltd. Built according to Software Requirement Specification v1.0.
            </div>
            <div className="flex items-center gap-3">
              <span>National Courier Logistics: TCS · Leopards · Trax · PostEx</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        onClose={() => setLastPlacedOrder(null)}
        onViewEmails={() => {
          if (lastPlacedOrder) {
            setEmailViewerOrder(lastPlacedOrder);
          }
        }}
        onTrackOrder={(orderId) => {
          setSelectedOrderId(orderId);
          setActiveView('tracking');
        }}
      />

      {/* Email Viewer Simulator Modal */}
      {emailViewerOrder && (
        <EmailSimulatorModal
          order={emailViewerOrder}
          onClose={() => setEmailViewerOrder(null)}
          onOpenAdminOrder={(order) => {
            setSelectedOrderId(order.id);
            setActiveView('admin');
          }}
          onOpenPackingSlip={(order) => {
            setPackingSlipOrder(order);
          }}
        />
      )}

      {/* Printable Packing Slip Modal */}
      {packingSlipOrder && (
        <PrintablePackingSlip
          order={packingSlipOrder}
          onClose={() => setPackingSlipOrder(null)}
        />
      )}

      {/* SRS Compliance Modal */}
      <SRSComplianceModal
        isOpen={isSRSModalOpen}
        onClose={() => setIsSRSModalOpen(false)}
      />
    </div>
  );
}
