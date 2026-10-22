import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Copy, ExternalLink, ShieldCheck, UserCheck } from 'lucide-react';
import { Order } from '../types';
import { generateCustomerEmailHtml, generateAdminEmailHtml } from '../utils/emailTemplates';

interface EmailSimulatorModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenAdminOrder?: (order: Order) => void;
  onOpenPackingSlip?: (order: Order) => void;
}

export const EmailSimulatorModal: React.FC<EmailSimulatorModalProps> = ({
  order,
  onClose,
  onOpenAdminOrder,
  onOpenPackingSlip
}) => {
  const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const customerEmail = generateCustomerEmailHtml(order);
  const adminEmail = generateAdminEmailHtml(order);

  const activeEmail = activeTab === 'CUSTOMER' ? customerEmail : adminEmail;
  const recipient = activeTab === 'CUSTOMER' ? order.customer.email : 'orders@khaas.pk (Store Administrator)';

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(activeEmail.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                Dual Automated Email Notification Engine
              </h2>
              <span className="text-[11px] bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded border border-emerald-700/60 font-mono">
                SRS Section 5
              </span>
            </div>
            <p className="text-xs text-stone-300">
              Live transactional email preview dispatched upon order placement for Order <strong>#{order.id}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls & SMTP Status */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex rounded-md p-1 bg-stone-200 gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('CUSTOMER')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'CUSTOMER'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>A. Customer Receipt Email</span>
            </button>

            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'ADMIN'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>B. Admin Order Alert</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHtml}
              className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>HTML Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Raw HTML</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Metadata Header */}
        <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 text-xs space-y-1 font-sans">
          <div className="flex gap-2">
            <span className="font-semibold text-stone-500 w-16">Subject:</span>
            <span className="font-bold text-stone-900">{activeEmail.subject}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-stone-500 w-16">To:</span>
            <span className="font-mono text-stone-800">{recipient}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-stone-500 w-16">SMTP Relay:</span>
            <span className="text-emerald-700 font-medium">
              SendGrid / Postmark Dedicated Relay · SPF / DKIM Passed · Deliverability 99.9%
            </span>
          </div>
        </div>

        {/* Email HTML Render Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-200/60 flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-sm overflow-hidden border border-stone-300">
            <iframe
              srcDoc={activeEmail.html}
              title={activeEmail.subject}
              className="w-full min-h-[580px] border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Footer with SRS Action links if Admin view */}
        {activeTab === 'ADMIN' && (
          <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs">
            <span className="text-stone-600 text-[11px]">
              Admin quick-action triggers referenced inside the notification email:
            </span>
            <div className="flex gap-2">
              {onOpenAdminOrder && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminOrder(order);
                  }}
                  className="px-3 py-1 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Open Order in Admin Panel
                </button>
              )}
              {onOpenPackingSlip && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPackingSlip(order);
                  }}
                  className="px-3 py-1 bg-amber-500 text-stone-950 rounded text-xs font-semibold hover:bg-amber-400 transition-colors"
                >
                  Print Packing Slip
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
