import React from 'react';
import { ShieldCheck, Truck, Smartphone, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onTrackClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onTrackClick }) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded">
              <span>National Artisanal Guild</span>
              <span className="text-amber-500">·</span>
              <span>Pakistan E-Commerce Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-medium tracking-tight text-white leading-[1.15] text-balance">
              Timeless Heritage, Handcrafted Across Pakistan
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              Handmade organic soaps from Ru's Glow. Experience seamless checkout localized for Pakistan with real-time EasyPaisa, JazzCash, and Meezan Bank IBFT integration.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-900 font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTrackClick}
                className="px-5 py-3 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm transition-colors border border-stone-700 whitespace-nowrap cursor-pointer"
              >
                Track Existing Order
              </button>
            </div>

            {/* SRS Flow highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800/80 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-200">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Local Gateways</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-snug">
                  EasyPaisa, JazzCash, & Direct IBFT
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-200">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Express Dispatch</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-snug">
                  TCS, Leopards & Trax Nationwide
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-200">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Dual Email Engine</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-snug">
                  Instant Customer & Admin Alerts
                </p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-stone-700 shadow-2xl bg-stone-950 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/11]">
              <img
                src="/src/assets/images/product_rus_glow_neem_soap.jpg"
                alt="Pakistani Artisan Craftsmanship"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-stone-200 text-xs flex justify-between items-center backdrop-blur-sm bg-stone-900/60 px-3 py-1.5 rounded border border-white/10">
                <span className="font-medium">Handcrafted in Lahore</span>
                <span className="text-amber-300 font-mono">100% Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
