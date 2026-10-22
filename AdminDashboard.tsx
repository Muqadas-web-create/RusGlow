import React, { useState } from 'react';
import { ShieldCheck, Truck, CheckCircle2, Clock, Printer, Eye, Search, Filter, AlertTriangle, ArrowUpRight, ExternalLink } from 'lucide-react';
import { CourierCarrier, Order, OrderStage } from '../types';
import { formatPKR } from '../utils/emailTemplates';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStage: (orderId: string, newStage: OrderStage, courierInfo?: { carrier: CourierCarrier; trackingId: string }) => void;
  onOpenPackingSlip: (order: Order) => void;
  onOpenEmails: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStage,
  onOpenPackingSlip,
  onOpenEmails
}) => {
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  // Dispatch modal form state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<CourierCarrier>('TCS');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPKR, 0);
  const pendingCount = orders.filter((o) => o.stage === 'PAYMENT_PENDING').length;
  const processingCount = orders.filter((o) => o.stage === 'PROCESSING').length;
  const shippedCount = orders.filter((o) => o.stage === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.stage === 'DELIVERED').length;

  const filteredOrders = orders.filter((order) => {
    const matchesStage = filterStage === 'ALL' || order.stage === filterStage;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.city.toLowerCase().includes(search.toLowerCase()) ||
      order.payment.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleVerifyPayment = (order: Order) => {
    onUpdateOrderStage(order.id, 'PROCESSING');
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...order, stage: 'PROCESSING' });
    }
  };

  const handleOpenDispatchModal = (order: Order) => {
    setSelectedOrder(order);
    const randomConsignment = `${selectedCarrier}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTrackingNumberInput(randomConsignment);
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = () => {
    if (!selectedOrder) return;
    onUpdateOrderStage(selectedOrder.id, 'SHIPPED', {
      carrier: selectedCarrier,
      trackingId: trackingNumberInput || `${selectedCarrier}-98201944`
    });
    setIsDispatchModalOpen(false);
  };

  const handleMarkDelivered = (order: Order) => {
    onUpdateOrderStage(order.id, 'DELIVERED');
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...order, stage: 'DELIVERED' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar / Admin Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Admin & Dispatch Center
            </span>
            <span className="text-stone-500">·</span>
            <span className="text-xs text-stone-400">SRS Section 2 & 6 Compliance</span>
          </div>
          <h1 className="text-2xl font-serif-display font-medium text-white mt-1">
            Store Order Administration & Logistics
          </h1>
          <p className="text-xs text-stone-300 mt-0.5">
            Manage incoming orders, verify IBFT/Wallet transactions, create courier bookings, and print warehouse packing slips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block">Total GMV</span>
            <span className="text-lg font-bold font-mono text-amber-300">{formatPKR(totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-amber-800 font-medium flex items-center justify-between">
            <span>Payment Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {pendingCount}
          </div>
          <div className="text-[11px] text-stone-500">Awaiting IBFT/Wallet review</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-blue-800 font-medium flex items-center justify-between">
            <span>Warehouse Processing</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {processingCount}
          </div>
          <div className="text-[11px] text-stone-500">Payment verified · Ready to pack</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-purple-800 font-medium flex items-center justify-between">
            <span>In Courier Transit</span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {shippedCount}
          </div>
          <div className="text-[11px] text-stone-500">Dispatched via TCS/Leopards</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-1">
          <div className="text-xs text-emerald-800 font-medium flex items-center justify-between">
            <span>Delivered & Closed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {deliveredCount}
          </div>
          <div className="text-[11px] text-stone-500">Fulfillment complete</div>
        </div>
      </div>

      {/* Main Content: Filter, Search, Order Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Stage Filter */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs font-semibold text-stone-600 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Stage:
            </span>
            {['ALL', 'PAYMENT_PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((stageKey) => (
              <button
                key={stageKey}
                onClick={() => setFilterStage(stageKey)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                  filterStage === stageKey
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {stageKey.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by ID, name, city, TRX..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Payment & TRX</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
                <th className="py-3 px-4">Fulfillment Stage</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-amber-50/40 cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id ? 'bg-amber-50/70' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-stone-900">#{order.id}</div>
                        <div className="text-[11px] text-stone-400">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{order.customer.fullName}</div>
                        <div className="text-stone-500 text-[11px]">
                          {order.customer.city} · {order.customer.phone}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-stone-800 uppercase text-[11px]">
                          <span className={`w-2 h-2 rounded-full ${order.payment.method === 'ibft' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                          {order.payment.method}
                        </div>
                        <div className="text-stone-500 font-mono text-[11px] truncate max-w-[140px]">
                          {order.payment.transactionId}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 tabular-nums">
                        {formatPKR(order.totalPKR)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            order.stage === 'PAYMENT_PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : order.stage === 'PROCESSING'
                              ? 'bg-blue-100 text-blue-800'
                              : order.stage === 'SHIPPED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {order.stage.replace('_', ' ')}
                        </span>
                        {order.courier && (
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                            {order.courier.carrier}: {order.courier.trackingId}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {order.stage === 'PAYMENT_PENDING' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyPayment(order);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Verify Payment Received"
                          >
                            Verify Payment
                          </button>
                        )}

                        {order.stage === 'PROCESSING' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDispatchModal(order);
                            }}
                            className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Create Courier Dispatch"
                          >
                            Dispatch Courier
                          </button>
                        )}

                        {order.stage === 'SHIPPED' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkDelivered(order);
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-semibold transition-colors cursor-pointer"
                            title="Mark as Delivered"
                          >
                            Mark Delivered
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenPackingSlip(order);
                          }}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded text-[11px] border border-stone-300 transition-colors cursor-pointer"
                          title="Print Packing Slip (SRS 5.B)"
                        >
                          <Printer className="w-3.5 h-3.5 inline mr-1" />
                          Slip
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Order Detailed Drawer / Inspection Box */}
      {selectedOrder && (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
                Quick Inspector · Order #{selectedOrder.id}
              </span>
              <h3 className="text-base font-bold text-stone-900">
                Customer: {selectedOrder.customer.fullName} ({selectedOrder.customer.phone})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenEmails(selectedOrder)}
                className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Generated Transactional Emails</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onOpenPackingSlip(selectedOrder)}
                className="px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generate Printable Packing Slip</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Delivery address */}
            <div className="bg-white p-3.5 rounded border border-stone-200 space-y-1">
              <span className="font-semibold text-stone-500 uppercase text-[10px]">Shipping Destination</span>
              <div className="font-bold text-stone-900">{selectedOrder.customer.fullName}</div>
              <div className="text-stone-600">{selectedOrder.customer.streetAddress}</div>
              <div className="text-stone-600">{selectedOrder.customer.city}, {selectedOrder.customer.postalCode}</div>
              <div className="text-stone-500">Phone: <strong>{selectedOrder.customer.phone}</strong></div>
            </div>

            {/* Payment Verification Info */}
            <div className="bg-white p-3.5 rounded border border-stone-200 space-y-1">
              <span className="font-semibold text-stone-500 uppercase text-[10px]">Payment Verification</span>
              <div className="font-bold text-stone-900 capitalize">{selectedOrder.payment.method}</div>
              <div className="font-mono text-stone-700">TRX ID: {selectedOrder.payment.transactionId}</div>
              {selectedOrder.payment.senderTitle && (
                <div className="text-stone-600">Sender Title: {selectedOrder.payment.senderTitle}</div>
              )}
              {selectedOrder.payment.receiptImage && (
                <div className="pt-1">
                  <a
                    href={selectedOrder.payment.receiptImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>View Uploaded Bank Receipt</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Items count & stage */}
            <div className="bg-white p-3.5 rounded border border-stone-200 space-y-1">
              <span className="font-semibold text-stone-500 uppercase text-[10px]">Status & Order Total</span>
              <div className="text-base font-bold font-mono text-stone-900">{formatPKR(selectedOrder.totalPKR)}</div>
              <div className="text-stone-600">
                {selectedOrder.items.reduce((s, i) => s + i.quantity, 0)} items in shipment
              </div>
              <div className="pt-1">
                Current Stage: <strong className="text-amber-800">{selectedOrder.stage.replace('_', ' ')}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courier Dispatch Modal */}
      {isDispatchModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Create Courier Dispatch Consignment
            </h3>
            <p className="text-xs text-stone-600">
              Assign a Pakistani courier carrier and booking consignment tracking ID for Order <strong>#{selectedOrder.id}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Select Courier Carrier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['TCS', 'Leopards', 'Trax', 'PostEx'] as CourierCarrier[]).map((carrier) => (
                    <button
                      key={carrier}
                      type="button"
                      onClick={() => {
                        setSelectedCarrier(carrier);
                        setTrackingNumberInput(`${carrier}-${Math.floor(10000000 + Math.random() * 90000000)}`);
                      }}
                      className={`p-2 rounded border text-center font-semibold transition-all cursor-pointer ${
                        selectedCarrier === carrier
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {carrier} Express
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Consignment Tracking Number / Waybill
                </label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded font-mono text-stone-900"
                />
              </div>

              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-600">
                Shipping to: <strong>{selectedOrder.customer.fullName}</strong>, {selectedOrder.customer.city}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded text-xs font-bold cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
