import React from 'react';
import { Plus, Eye, MapPin, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../utils/emailTemplates';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isAdded = false
}) => {
  return (
    <div className="group bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Media container */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Graceful fallback container if needed
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        
        {/* Inventory Badge strictly adhering to anti-pill clean text rules */}
        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-stone-100 text-[11px] font-medium px-2 py-0.5 rounded">
          {product.inStock ? `In Stock (${product.stockCount} left)` : 'Out of Stock'}
        </div>

        {/* Origin tag */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[11px] px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
          <MapPin className="w-3 h-3 text-amber-700" />
          <span className="font-medium truncate max-w-[180px]">{product.origin}</span>
        </div>

        {/* Quick view button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-stone-700 hover:text-stone-950 hover:bg-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            {product.category} · {product.sku}
          </div>

          <h3 
            onClick={() => onViewDetails(product)}
            className="text-base font-semibold text-stone-900 line-clamp-1 hover:text-amber-800 transition-colors cursor-pointer"
          >
            {product.title}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-bold text-stone-900 font-mono tabular-nums">
              {formatPKR(product.pricePKR)}
            </div>
            {product.originalPricePKR && (
              <div className="text-xs text-stone-400 line-through font-mono tabular-nums">
                {formatPKR(product.originalPricePKR)}
              </div>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : product.inStock
                ? 'bg-stone-900 hover:bg-stone-800 text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
