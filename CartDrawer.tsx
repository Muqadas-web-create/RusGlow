import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { formatPKR } from '../utils/emailTemplates';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.pricePKR * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 250;
  const total = subtotal + shippingFee;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-800" />
            <h2 className="text-lg font-bold text-stone-900">Shopping Bag</h2>
            <span className="text-xs text-stone-500 font-mono">
              ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-amber-50 px-5 py-2.5 border-b border-amber-200 text-xs text-amber-900">
          {remainingForFree === 0 ? (
            <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <span>✓ You have unlocked FREE Nationwide Courier Delivery!</span>
            </div>
          ) : (
            <div>
              Add <span className="font-bold font-mono">{formatPKR(remainingForFree)}</span> more for <strong>FREE Nationwide Delivery</strong>
              <div className="w-full bg-amber-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-amber-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 stroke-1" />
              <div className="text-base font-medium text-stone-600">Your bag is currently empty</div>
              <p className="text-xs text-stone-400 max-w-xs">
                Explore our curated collection of handcrafted Pakistani mastercrafts.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-stone-900 text-stone-100 text-xs font-semibold rounded hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 pb-4 border-b border-stone-100 last:border-b-0 items-center"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-stone-900 truncate">
                    {item.product.title}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-mono">
                    SKU: {item.product.sku}
                  </div>
                  <div className="text-xs font-bold text-stone-900 mt-1 font-mono tabular-nums">
                    {formatPKR(item.product.pricePKR)}
                  </div>
                </div>

                {/* Steppers */}
                <div className="flex items-center border border-stone-200 rounded overflow-hidden">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="p-1 hover:bg-stone-100 text-stone-600 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-xs font-semibold font-mono tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="p-1 hover:bg-stone-100 text-stone-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer calculation & checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums font-medium text-stone-900">
                  {formatPKR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Courier Delivery (Nationwide)</span>
                <span className="font-mono tabular-nums font-medium text-stone-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    formatPKR(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-base">
                  {formatPKR(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>EasyPaisa · JazzCash · Direct Bank Transfer (IBFT)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
