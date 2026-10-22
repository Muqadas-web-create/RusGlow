import React from 'react';
import { ShoppingBag, ShieldCheck, Mail, Package, FileText } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeView: 'storefront' | 'tracking' | 'admin' | 'emails';
  setActiveView: (view: 'storefront' | 'tracking' | 'admin' | 'emails') => void;
  onOpenSRSModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cart,
  onOpenCart,
  activeView,
  setActiveView,
  onOpenSRSModal
}) => {
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 backdrop-blur-md">
      {/* Top Banner - Single line slim promo banner */}
      <div className="bg-emerald-900/90 text-emerald-100 text-xs py-1.5 px-4 text-center border-b border-emerald-800/60 font-medium tracking-wide flex items-center justify-center gap-2">
        <span>🇵🇰 Free Nationwide Courier Delivery on Orders Above Rs. 5,000</span>
        <span className="text-emerald-300">·</span>
        <span>EasyPaisa, JazzCash & IBFT Supported</span>
      </div>

      {/* Main Top Bar adhering strictly to Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setActiveView('storefront')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-2xl font-serif-display font-bold tracking-tight text-amber-100 group-hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
            RusGlow
          </span>
          <span className="text-[10px] tracking-widest text-stone-400 uppercase ml-2 hidden sm:inline">
            Artisanal Pakistan
          </span>
        </button>

        {/* Zone 2: Navigation Links (single-line, clean text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => setActiveView('storefront')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'storefront'
                ? 'text-amber-200 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Storefront
          </button>
          <button
            onClick={() => setActiveView('tracking')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'tracking'
                ? 'text-amber-200 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Track Order</span>
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-amber-200 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Store Admin & Courier</span>
          </button>
          <button
            onClick={() => setActiveView('emails')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeView === 'emails'
                ? 'text-amber-200 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Dual Email Engine</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSRSModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded-md transition-colors border border-stone-700 whitespace-nowrap"
            title="View SRS Document Compliance"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>SRS Specs</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-stone-900 text-amber-300 text-xs px-1.5 py-0.5 rounded-full font-mono tabular-nums">
              {totalCartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-800 bg-stone-950/80 px-2 py-2 text-xs font-medium text-stone-300">
        <button
          onClick={() => setActiveView('storefront')}
          className={`px-2 py-1 ${activeView === 'storefront' ? 'text-amber-300 font-semibold' : 'text-stone-400'}`}
        >
          Storefront
        </button>
        <button
          onClick={() => setActiveView('tracking')}
          className={`px-2 py-1 ${activeView === 'tracking' ? 'text-amber-300 font-semibold' : 'text-stone-400'}`}
        >
          Track
        </button>
        <button
          onClick={() => setActiveView('admin')}
          className={`px-2 py-1 ${activeView === 'admin' ? 'text-amber-300 font-semibold' : 'text-stone-400'}`}
        >
          Admin
        </button>
        <button
          onClick={() => setActiveView('emails')}
          className={`px-2 py-1 ${activeView === 'emails' ? 'text-amber-300 font-semibold' : 'text-stone-400'}`}
        >
          Emails
        </button>
        <button
          onClick={onOpenSRSModal}
          className="px-2 py-1 text-amber-400"
        >
          SRS Doc
        </button>
      </div>
    </header>
  );
};
