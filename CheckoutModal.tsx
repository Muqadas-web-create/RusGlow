import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Upload, AlertCircle, Building, Smartphone, CreditCard } from 'lucide-react';
import { CartItem, Order, PaymentMethodType, ShippingAddress } from '../types';
import { PAKISTAN_CITIES, PAYMENT_GATEWAY_CONFIG } from '../data/initialData';
import { formatPKR } from '../utils/emailTemplates';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.pricePKR * item.quantity, 0);
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shippingFee;

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: 'Lahore',
    postalCode: '',
    orderNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('easypaisa');
  const [transactionId, setTransactionId] = useState('');
  const [senderAccountOrTitle, setSenderAccountOrTitle] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Phone validation for Pakistani format: 03XX-XXXXXXX or 03XXXXXXXXX
  const handlePhoneChange = (val: string) => {
    // Keep numbers and hyphen
    const clean = val.replace(/[^\d-]/g, '');
    setFormData((prev) => ({ ...prev, phone: clean }));
  };

  // Receipt image mock / FileReader upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address for receiving your receipt.');
      return;
    }

    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (digitsOnly.length < 11 || !digitsOnly.startsWith('03')) {
      setErrorMsg('Please enter a valid Pakistani mobile number starting with 03 (e.g., 0321-4455890).');
      return;
    }

    if (!formData.streetAddress.trim()) {
      setErrorMsg('Please enter your complete street address for courier dispatch.');
      return;
    }

    if (!formData.postalCode.trim()) {
      setErrorMsg('Please enter your city postal code (e.g. 54000).');
      return;
    }

    if (!transactionId.trim() && !receiptImage) {
      setErrorMsg('Please provide your Transaction ID / Reference or upload receipt screenshot.');
      return;
    }

    setIsSubmitting(true);

    // Generate Order ID (e.g., PK-719302)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `PK-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: { ...formData },
      items: [...cart],
      subtotalPKR: subtotal,
      shippingFeePKR: shippingFee,
      totalPKR: total,
      payment: {
        method: paymentMethod,
        transactionId: transactionId.trim() || `TXN-${randomNum}`,
        accountNumber: senderAccountOrTitle,
        senderTitle: senderAccountOrTitle,
        receiptImage: receiptImage || undefined
      },
      stage: 'PAYMENT_PENDING'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden border border-stone-200 my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold font-serif-display text-white">
              Complete Your Order (Pakistan Checkout)
            </h2>
            <p className="text-xs text-stone-300">
              Capturing verified courier shipping address & local payment verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Customer Shipping Information (SRS 4.1) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="border-b border-stone-200 pb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                  1. Shipping & Customer Details
                </h3>
                <span className="text-[11px] text-stone-500">Mandatory Fields</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Muhammad Usman"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Email Address (For Order Receipt) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="usman@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      WhatsApp / Mobile (Pakistani 03XX) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Detailed Street Address (House / Flat, Street, Area) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House # 14-B, Street 5, Phase 4 DHA"
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 bg-white"
                    >
                      {PAKISTAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 54000"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Special Delivery Instructions / Courier Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Deliver between 2pm-6pm, call before arriving"
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 bg-white"
                  />
                </div>
              </div>

              {/* Local Payment Gateway Selection (SRS 4.2) */}
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                    2. Local Payment Gateway
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    100% Secure Local Transfer
                  </span>
                </div>

                {/* Gateway Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('easypaisa')}
                    className={`p-3 rounded border text-left transition-all cursor-pointer ${
                      paymentMethod === 'easypaisa'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>EasyPaisa</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">Mobile Wallet</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('jazzcash')}
                    className={`p-3 rounded border text-left transition-all cursor-pointer ${
                      paymentMethod === 'jazzcash'
                        ? 'border-red-600 bg-red-50 text-red-950 ring-1 ring-red-600'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <CreditCard className="w-3.5 h-3.5 text-red-600" />
                      <span>JazzCash</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">Wallet & Till ID</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ibft')}
                    className={`p-3 rounded border text-left transition-all cursor-pointer ${
                      paymentMethod === 'ibft'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 ring-1 ring-blue-600'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Building className="w-3.5 h-3.5 text-blue-600" />
                      <span>Bank (IBFT)</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">Meezan Bank</div>
                  </button>
                </div>

                {/* Gateway Detail Panel */}
                <div className="p-4 rounded border border-stone-200 bg-stone-50 space-y-3 text-xs">
                  {paymentMethod === 'easypaisa' && (
                    <div className="space-y-2.5">
                      <div className="font-bold text-stone-900 text-sm flex items-center justify-between">
                        <span>EasyPaisa Merchant Wallet</span>
                        <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          0345-8821900
                        </span>
                      </div>
                      <div className="text-stone-600 leading-relaxed text-[11px]">
                        {PAYMENT_GATEWAY_CONFIG.easypaisa.instructions}
                      </div>
                      <div className="bg-white p-2.5 rounded border border-stone-200 font-mono text-[11px] space-y-1">
                        <div>Account Title: <strong>Rusglow ARTISAN PVT LTD</strong></div>
                        <div>Account No: <strong>0345-8821900</strong></div>
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          EasyPaisa 11-digit Transaction ID (TRX ID) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 98124018291"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-stone-900 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'jazzcash' && (
                    <div className="space-y-2.5">
                      <div className="font-bold text-stone-900 text-sm flex items-center justify-between">
                        <span>JazzCash Official Merchant</span>
                        <span className="text-[11px] font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Till ID: 00291822
                        </span>
                      </div>
                      <div className="text-stone-600 leading-relaxed text-[11px]">
                        {PAYMENT_GATEWAY_CONFIG.jazzcash.instructions}
                      </div>
                      <div className="bg-white p-2.5 rounded border border-stone-200 font-mono text-[11px] space-y-1">
                        <div>Merchant Name: <strong>RusGlow RETAIL PAKISTAN</strong></div>
                        <div>Mobile Account: <strong>0300-5544321</strong> / Till ID: <strong>00291822</strong></div>
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          JazzCash TID / Transaction ID (from SMS receipt) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. JC-78219401"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-stone-900 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'ibft' && (
                    <div className="space-y-2.5">
                      <div className="font-bold text-stone-900 text-sm flex items-center justify-between">
                        <span>Direct Bank Transfer (IBFT - 24/7)</span>
                        <span className="text-[11px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Meezan Bank
                        </span>
                      </div>
                      <div className="text-stone-600 leading-relaxed text-[11px]">
                        {PAYMENT_GATEWAY_CONFIG.ibft.instructions}
                      </div>
                      <div className="bg-white p-2.5 rounded border border-stone-200 font-mono text-[11px] space-y-1 select-all">
                        <div>Bank: <strong>Meezan Bank Limited (Islamic)</strong></div>
                        <div>Title: <strong>RusGlow Lifestyle Pvt Ltd</strong></div>
                        <div>IBAN: <strong>PK36MEZN0001000103492811</strong></div>
                        <div>Branch: Gulberg III, Lahore</div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            Transfer Reference / Txn ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. MEZN-99104"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-stone-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            Sender Account Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Usman Tariq"
                            value={senderAccountOrTitle}
                            onChange={(e) => setSenderAccountOrTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded text-stone-900 bg-white"
                          />
                        </div>
                      </div>

                      {/* Receipt Upload */}
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          Upload IBFT Payment Receipt / Screenshot
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-xs cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Select Screenshot</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                          {receiptImage && (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Receipt Attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Placement */}
            <div className="lg:col-span-5 space-y-5">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
                  Order Summary
                </h3>
              </div>

              {/* Items List */}
              <div className="bg-stone-50 border border-stone-200 rounded p-3.5 space-y-3 max-h-[220px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-2.5 items-center text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-10 h-10 object-cover rounded border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-stone-900 truncate">
                        {item.product.title}
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        Qty: {item.quantity} × {formatPKR(item.product.pricePKR)}
                      </div>
                    </div>
                    <div className="font-mono font-medium text-stone-900 tabular-nums">
                      {formatPKR(item.product.pricePKR * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="bg-stone-50 border border-stone-200 rounded p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Nationwide Courier Delivery</span>
                  <span className="font-mono tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE (Above Rs. 5k)</span>
                    ) : (
                      formatPKR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Sales Tax (FBR / PRA)</span>
                  <span className="font-mono text-stone-500">Included</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Total Payable (PKR)</span>
                  <span className="font-mono tabular-nums text-base text-amber-700">
                    {formatPKR(total)}
                  </span>
                </div>
              </div>

              {/* Dual Email Automation Notice (SRS 5) */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Dual Automated Notifications Triggered:</span>
                </div>
                <p className="text-emerald-800 leading-snug">
                  1. Customer Email Receipt dispatched to your email.<br />
                  2. Store Admin Alert sent for immediate IBFT/Wallet verification.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold text-sm rounded transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Confirm Order & Pay {formatPKR(total)}</span>
                  </>
                )}
              </button>

              <div className="text-[10px] text-stone-400 text-center leading-tight">
                By confirming, you agree to RusGlow Pakistan terms of fulfillment. Payment verification takes 10-60 minutes during standard business hours.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
