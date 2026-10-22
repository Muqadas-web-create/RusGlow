import React from 'react';
import { CheckCircle, Mail, Package, ArrowRight, MessageSquare, ExternalLink } from 'lucide-react';
import { Order } from '../types';
import { formatPKR } from '../utils/emailTemplates';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewEmails: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewEmails,
  onTrackOrder
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-stone-200 p-6 sm:p-8 text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        {/* Headings */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Order Successfully Placed
          </span>
          <h2 className="text-2xl font-serif-display font-bold text-stone-900 pt-2">
            Order #{order.id}
          </h2>
          <p className="text-xs text-stone-500">
            A confirmation receipt has been dispatched to <strong>{order.customer.email}</strong>
          </p>
        </div>

        {/* Order Details Brief Box */}
        <div className="bg-stone-50 border border-stone-200 rounded p-4 text-xs text-left space-y-2">
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">Total Paid/Payable:</span>
            <span className="font-bold font-mono text-stone-900 tabular-nums">
              {formatPKR(order.totalPKR)}
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">Payment Channel:</span>
            <span className="font-semibold text-stone-800 capitalize">
              {order.payment.method} ({order.payment.transactionId})
            </span>
          </div>
          <div className="flex justify-between border-b border-stone-200 pb-2">
            <span className="text-stone-500">Shipping To:</span>
            <span className="font-medium text-stone-800 truncate max-w-[200px]">
              {order.customer.city} · {order.customer.fullName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Estimated Courier Transit:</span>
            <span className="font-semibold text-emerald-700">3-5 Business Days</span>
          </div>
        </div>

        {/* Automated Dual Email Engine Notification */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded text-left text-xs space-y-2">
          <div className="font-semibold text-amber-900 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-amber-700" />
            <span>Dual Automated Email Alert Triggered</span>
          </div>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            Per SRS Section 5, transactional emails were simultaneously generated for both the Customer and the Store Admin.
          </p>
          <button
            onClick={() => {
              onClose();
              onViewEmails();
            }}
            className="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs rounded border border-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Preview Customer & Admin Emails</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onTrackOrder(order.id);
            }}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Track Order & Shipping Lifecycle</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://wa.me/923458821900?text=Salam%20Khaas,%20inquiring%20about%20Order%20${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>

            <button
              onClick={onClose}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs rounded transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
