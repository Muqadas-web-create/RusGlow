import React from 'react';
import { X, Printer, Package, CheckSquare, ShieldCheck } from 'lucide-react';
import { Order } from '../types';
import { formatPKR } from '../utils/emailTemplates';

interface PrintablePackingSlipProps {
  order: Order | null;
  onClose: () => void;
}

export const PrintablePackingSlip: React.FC<PrintablePackingSlipProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden border border-stone-300">
        {/* Screen Controls Header (hidden in print) */}
        <div className="print:hidden p-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Printable Packing Slip & Dispatch Manifest</span>
            <span className="text-xs text-stone-400">· #{order.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Packing Slip Body (Target for print) */}
        <div id="printable-packing-slip" className="p-8 text-stone-900 bg-white font-sans text-xs space-y-6">
          {/* Top Brand & Barcode */}
          <div className="flex justify-between items-start border-b-2 border-stone-900 pb-5">
            <div>
              <h1 className="text-2xl font-serif-display font-bold tracking-tight text-stone-950">
                 RusGlow
              </h1>
              <p className="text-[11px] text-stone-600 font-medium">
                National Artisanal Warehouse & Fulfillment Hub
              </p>
              <p className="text-[10px] text-stone-500">
                Gulberg III, Main Boulevard, Lahore, Pakistan · NTN: 9482019-3
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-widest text-stone-500">
                Consignment Packing Slip
              </div>
              <div className="font-mono text-base font-bold text-stone-900">
                #{order.id}
              </div>
              <div className="text-[10px] text-stone-500">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </div>

              {/* Barcode Graphic */}
              <div className="pt-1 flex flex-col items-end">
                <div className="font-mono tracking-widest text-[9px] text-stone-400 mb-0.5">
                  ||||| | |||| |||||| || | |||| |||
                </div>
                <div className="font-mono text-[9px] text-stone-500 font-bold">
                  *{order.id}*
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Label Box & Courier Manifest */}
          <div className="grid grid-cols-2 gap-4 border border-stone-300 rounded p-4 bg-stone-50/50">
            {/* Left: Ship To */}
            <div className="space-y-1 border-r border-stone-200 pr-3">
              <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Consignee / Ship To:
              </div>
              <div className="font-bold text-sm text-stone-950">{order.customer.fullName}</div>
              <div className="text-stone-700 leading-snug">{order.customer.streetAddress}</div>
              <div className="font-bold text-stone-900">
                {order.customer.city}, Pakistan ({order.customer.postalCode})
              </div>
              <div className="text-stone-800 pt-1 font-mono font-medium">
                Phone: {order.customer.phone}
              </div>
            </div>

            {/* Right: Courier Carrier & Payment Info */}
            <div className="space-y-1 pl-1">
              <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Logistics & Carrier Details:
              </div>
              <div>
                Carrier: <strong>{order.courier ? order.courier.carrier : 'TCS Express (Standard)'}</strong>
              </div>
              <div className="font-mono text-stone-800">
                Tracking Ref: <strong>{order.courier ? order.courier.trackingId : 'BOOKING_PENDING'}</strong>
              </div>
              <div className="pt-1">
                Payment Channel: <strong className="capitalize">{order.payment.method}</strong>
              </div>
              <div className="text-stone-600 font-mono text-[11px]">
                TRX Ref: {order.payment.transactionId}
              </div>
              <div className="text-emerald-800 font-bold flex items-center gap-1 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Payment Verified for Dispatch</span>
              </div>
            </div>
          </div>

          {/* Itemized Pick & Pack Table */}
          <div>
            <div className="text-[11px] uppercase font-bold text-stone-700 mb-2 tracking-wide flex justify-between">
              <span>Itemized Packing List (Warehouse Picking Checklist)</span>
              <span>Total Units: {order.items.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>

            <table className="w-full border-collapse border border-stone-300">
              <thead className="bg-stone-100 font-bold text-[11px] text-stone-800">
                <tr>
                  <th className="border border-stone-300 p-2 text-center w-10">Pick</th>
                  <th className="border border-stone-300 p-2 text-left">Item Description</th>
                  <th className="border border-stone-300 p-2 text-left">SKU / Origin</th>
                  <th className="border border-stone-300 p-2 text-center w-14">Qty</th>
                  <th className="border border-stone-300 p-2 text-right w-24">Unit Price</th>
                  <th className="border border-stone-300 p-2 text-right w-24">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="border border-stone-300 p-2 text-center">
                      <div className="w-4 h-4 border border-stone-400 rounded-xs mx-auto flex items-center justify-center font-bold text-emerald-700">
                        ✓
                      </div>
                    </td>
                    <td className="border border-stone-300 p-2">
                      <div className="font-bold text-stone-900">{item.product.title}</div>
                      <div className="text-[10px] text-stone-500">{item.product.subtitle}</div>
                    </td>
                    <td className="border border-stone-300 p-2 font-mono text-[10px] text-stone-600">
                      {item.product.sku}<br />
                      <span className="text-stone-500">{item.product.origin}</span>
                    </td>
                    <td className="border border-stone-300 p-2 text-center font-mono font-bold text-stone-900">
                      {item.quantity}
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono text-stone-700">
                      {formatPKR(item.product.pricePKR)}
                    </td>
                    <td className="border border-stone-300 p-2 text-right font-mono font-bold text-stone-900">
                      {formatPKR(item.product.pricePKR * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 border border-stone-200 rounded bg-stone-50 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-500">Customer Delivery Instructions</span>
              <p className="text-stone-700 italic">
                {order.customer.orderNotes || 'Handle with care. Standard fragile shipping protocol.'}
              </p>
            </div>

            <div className="space-y-1 text-right text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatPKR(order.subtotalPKR)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Courier Logistics:</span>
                <span className="font-mono">
                  {order.shippingFeePKR === 0 ? 'FREE (Orders > Rs. 5k)' : formatPKR(order.shippingFeePKR)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-stone-950 border-t border-stone-400 pt-1 text-sm">
                <span>Invoice Total:</span>
                <span className="font-mono">{formatPKR(order.totalPKR)}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Quality Control */}
          <div className="pt-6 border-t border-dashed border-stone-300 grid grid-cols-3 gap-6 text-[10px] text-stone-600">
            <div>
              <div className="border-b border-stone-400 h-8" />
              <div className="mt-1 font-semibold uppercase">Warehouse Picker Signature</div>
            </div>
            <div>
              <div className="border-b border-stone-400 h-8" />
              <div className="mt-1 font-semibold uppercase">Quality QC Checked</div>
            </div>
            <div>
              <div className="border-b border-stone-400 h-8" />
              <div className="mt-1 font-semibold uppercase">Courier Handover Stamp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
