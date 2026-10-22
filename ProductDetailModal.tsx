import React from 'react';
import { X, Check, MapPin, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../utils/emailTemplates';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden border border-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery Column */}
          <div className="relative bg-stone-100 min-h-[320px]">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 left-3 bg-stone-900/80 text-white text-xs px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{product.origin}</span>
            </div>
          </div>

          {/* Details & Contiguous Purchase Module */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                  {product.category} · {product.sku}
                </span>
                <h2 className="text-2xl font-serif-display font-bold text-stone-900 mt-1">
                  {product.title}
                </h2>
                <p className="text-sm text-stone-500 mt-0.5">{product.subtitle}</p>
              </div>

              {/* Price row */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                  {formatPKR(product.pricePKR)}
                </span>
                {product.originalPricePKR && (
                  <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                    {formatPKR(product.originalPricePKR)}
                  </span>
                )}
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Save {formatPKR((product.originalPricePKR || 0) - product.pricePKR)}
                </span>
              </div>

              {/* Availability & Inventory */}
              <div className="text-xs text-stone-600 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span>{product.inStock ? `Available in inventory (${product.stockCount} units remaining)` : 'Temporarily Out of Stock'}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-stone-700 leading-relaxed">
                {product.description}
              </p>

              {/* Specs */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
                  Product Specifications & Authenticity:
                </div>
                <ul className="text-xs text-stone-600 space-y-1">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Courier info */}
              <div className="bg-stone-50 border border-stone-200 rounded p-3 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-stone-800">
                  <Truck className="w-4 h-4 text-stone-700" />
                  <span>Pakistan Logistics & Courier SLA</span>
                </div>
                <div>Lahore, Karachi, Islamabad: <strong>2-3 Business Days</strong></div>
                <div>Other Cities: <strong>3-5 Business Days</strong> via Leopard / TCS</div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={!product.inStock}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 text-white font-semibold text-sm rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag — {formatPKR(product.pricePKR)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
