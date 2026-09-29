import React, { useState, useEffect, useMemo, useCallback } from 'react';

export interface OrderItemModifier {
  groupName: string;
  optionName: string;
  priceDelta: number;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  modifiers?: OrderItemModifier[];
}

export interface AdminOrder {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryZone: string;
  deliveryAddress: string;
  referencePoint: string | null;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: string | number;
  deliveryFee: string | number;
  total: string | number;
  status: string;
  createdAt: string;
}

export const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; icon: string; nextStatus?: string; nextLabel?: string }> = {
  pending_whatsapp: {
    label: 'A la Mano (Nuevo)',
    badgeClass: 'bg-amber-300 text-black border-black',
    icon: '⚡',
    nextStatus: 'in_preparation',
    nextLabel: '👨‍🍳 A Cocina',
  },
  pending_review: {
    label: 'Por Revisar',
    badgeClass: 'bg-orange-300 text-black border-black',
    icon: '⚠️',
    nextStatus: 'in_preparation',
    nextLabel: '👨‍🍳 A Cocina',
  },
  in_preparation: {
    label: 'En Preparación',
    badgeClass: 'bg-brandBlue text-white border-black',
    icon: '👨‍🍳',
    nextStatus: 'ready_to_dispatch',
    nextLabel: '📦 Listo para Despachar',
  },
  ready_to_dispatch: {
    label: 'Por Despachar',
    badgeClass: 'bg-yellow-400 text-black border-black',
    icon: '🛵',
    nextStatus: 'dispatched',
    nextLabel: '🚚 Salir a Despacho',
  },
  dispatched: {
    label: 'En Camino',
    badgeClass: 'bg-indigo-500 text-white border-black',
    icon: '🚚',
    nextStatus: 'delivered',
    nextLabel: '✅ Marcar Entregado',
  },
  delivered: {
    label: 'Entregado',
    badgeClass: 'bg-emerald-500 text-white border-black',
    icon: '✅',
  },
  cancelled: {
    label: 'Cancelado',
    badgeClass: 'bg-red-500 text-white border-black',
    icon: '❌',
  },
};

export default function OrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selectedTicketOrder, setSelectedTicketOrder] = useState<AdminOrder | null>(null);

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'No se pudieron cargar los pedidos.');
      }
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
      setLastRefreshed(new Date());
    } catch (err: any) {
      if (!isSilent) setError(err.message || 'Error de conexión.');
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Polling automático cada 20 segundos para la pantalla de despacho / cocina
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchOrders]);

  async function handleStatusChange(orderId: number, nextStatus: string) {
    setUpdatingId(orderId);
    setError('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'No se pudo actualizar el estado.');

      // Actualizar estado local inmediato
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
      );
    } catch (err: any) {
      setError(err.message || 'Error al actualizar pedido.');
    } finally {
      setUpdatingId(null);
    }
  }

  // Métricas y Contadores KPI
  const stats = useMemo(() => {
    const total = orders.length;
    const aLaMano = orders.filter((o) => o.status === 'pending_whatsapp' || o.status === 'pending_review').length;
    const enCocina = orders.filter((o) => o.status === 'in_preparation').length;
    const porDespachar = orders.filter((o) => o.status === 'ready_to_dispatch' || o.status === 'dispatched').length;
    const entregados = orders.filter((o) => o.status === 'delivered').length;
    const totalVentas = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, o) => acc + (Number(o.total) || 0), 0);

    return { total, aLaMano, enCocina, porDespachar, entregados, totalVentas };
  }, [orders]);

  // Filtrado de pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Filtro de estado
      if (filterStatus === 'a_la_mano') {
        if (o.status !== 'pending_whatsapp' && o.status !== 'pending_review') return false;
      } else if (filterStatus === 'en_cocina') {
        if (o.status !== 'in_preparation') return false;
      } else if (filterStatus === 'por_despachar') {
        if (o.status !== 'ready_to_dispatch' && o.status !== 'dispatched') return false;
      } else if (filterStatus === 'entregados') {
        if (o.status !== 'delivered') return false;
      } else if (filterStatus === 'cancelados') {
        if (o.status !== 'cancelled') return false;
      }

      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.customerPhone.includes(q);
        const matchesZone = o.deliveryZone.toLowerCase().includes(q);
        const matchesId = String(o.id).includes(q);
        return matchesName || matchesPhone || matchesZone || matchesId;
      }

      return true;
    });
  }, [orders, filterStatus, searchQuery]);

  function formatTime(isoString: string) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  }

  function formatDate(isoString: string) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short' });
    } catch {
      return '';
    }
  }

  function formatWhatsAppLink(phone: string, order: AdminOrder) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const validPhone = cleanPhone.startsWith('58') ? cleanPhone : cleanPhone.startsWith('0') ? `58${cleanPhone.slice(1)}` : `58${cleanPhone}`;
    const text = encodeURIComponent(
      `¡Hola ${order.customerName}! 🌭 Te escribimos de Pepitos House 251 sobre tu pedido #${order.id}.`
    );
    return `https://wa.me/${validPhone}?text=${text}`;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div 
          onClick={() => setFilterStatus('a_la_mano')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border-3 border-black shadow-brutal transition-transform hover:-translate-y-1 ${filterStatus === 'a_la_mano' ? 'ring-4 ring-brandYellow' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-gray-600">A la Mano</span>
            <span className="text-xl">⚡</span>
          </div>
          <div className="font-display font-black text-3xl mt-1 text-amber-500">{stats.aLaMano}</div>
          <span className="text-[10px] font-bold text-gray-500">Nuevos / Por confirmar</span>
        </div>

        <div 
          onClick={() => setFilterStatus('en_cocina')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border-3 border-black shadow-brutal transition-transform hover:-translate-y-1 ${filterStatus === 'en_cocina' ? 'ring-4 ring-brandBlue' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-gray-600">En Cocina</span>
            <span className="text-xl">👨‍🍳</span>
          </div>
          <div className="font-display font-black text-3xl mt-1 text-brandBlue">{stats.enCocina}</div>
          <span className="text-[10px] font-bold text-gray-500">En preparación</span>
        </div>

        <div 
          onClick={() => setFilterStatus('por_despachar')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border-3 border-black shadow-brutal transition-transform hover:-translate-y-1 ${filterStatus === 'por_despachar' ? 'ring-4 ring-yellow-400' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-gray-600">Por Despachar</span>
            <span className="text-xl">🛵</span>
          </div>
          <div className="font-display font-black text-3xl mt-1 text-orange-500">{stats.porDespachar}</div>
          <span className="text-[10px] font-bold text-gray-500">Listos / En camino</span>
        </div>

        <div 
          onClick={() => setFilterStatus('entregados')}
          className={`cursor-pointer bg-white p-4 rounded-2xl border-3 border-black shadow-brutal transition-transform hover:-translate-y-1 ${filterStatus === 'entregados' ? 'ring-4 ring-emerald-500' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-gray-600">Entregados</span>
            <span className="text-xl">✅</span>
          </div>
          <div className="font-display font-black text-3xl mt-1 text-emerald-600">{stats.entregados}</div>
          <span className="text-[10px] font-bold text-gray-500">Completados</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-black text-white p-4 rounded-2xl border-3 border-black shadow-brutal">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase text-gray-400">Total Ventas</span>
            <span className="text-xl">💵</span>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl mt-1 text-brandYellow">
            ${stats.totalVentas.toFixed(2)}
          </div>
          <span className="text-[10px] font-bold text-gray-400">{stats.total} pedidos totales</span>
        </div>
      </div>

      {/* Control Bar: Filters, Search & Refresh */}
      <div className="bg-white p-4 rounded-3xl border-4 border-black shadow-brutal space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Todos', count: stats.total },
              { id: 'a_la_mano', label: '⚡ A la Mano', count: stats.aLaMano },
              { id: 'en_cocina', label: '👨‍🍳 En Cocina', count: stats.enCocina },
              { id: 'por_despachar', label: '🛵 Por Despachar', count: stats.porDespachar },
              { id: 'entregados', label: '✅ Entregados', count: stats.entregados },
              { id: 'cancelados', label: '❌ Cancelados' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-full border-2 border-black font-display font-black text-xs uppercase transition cursor-pointer flex items-center gap-1.5 ${
                  filterStatus === tab.id
                    ? 'bg-black text-white shadow-brutal'
                    : 'bg-brandPillBg text-black hover:bg-white'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full border border-black font-mono font-bold ${filterStatus === tab.id ? 'bg-brandYellow text-black' : 'bg-white text-black'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Refresh & Live indicator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              title="Activar/desactivar actualización en tiempo real cada 20s"
              className={`px-3 py-1.5 rounded-full border-2 border-black text-xs font-black uppercase transition cursor-pointer flex items-center gap-1.5 ${
                autoRefresh ? 'bg-emerald-100 text-emerald-900 border-emerald-600' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
              <span>{autoRefresh ? 'En vivo' : 'Pausado'}</span>
            </button>

            <button
              type="button"
              onClick={() => fetchOrders()}
              disabled={loading}
              className="bg-brandYellow hover:bg-white text-black font-display font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-black shadow-brutal uppercase transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
            >
              <span className={loading ? 'animate-spin' : ''}>🔄</span>
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-3 pt-1 border-t-2 border-black/10">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, teléfono, zona o # orden..."
              className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
            />
            <span className="absolute left-3 top-2.5 text-xs text-gray-500">🔍</span>
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-black uppercase text-gray-600 hover:text-black underline cursor-pointer"
            >
              Limpiar
            </button>
          )}
          <span className="text-[11px] font-bold text-gray-500 hidden sm:inline">
            Última sync: {lastRefreshed.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {error && (
        <div role="alert" className="bg-red-100 border-3 border-red-600 text-red-900 font-display font-black text-xs px-4 py-3 rounded-2xl uppercase shadow-brutal">
          ⚠️ {error}
        </div>
      )}

      {/* Orders List / Empty State */}
      {loading && orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-4 border-black text-center space-y-3 shadow-brutal">
          <div className="text-4xl animate-bounce">📦</div>
          <div className="font-display font-black text-lg uppercase">Cargando pedidos de cocina...</div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-4 border-black text-center space-y-3 shadow-brutal">
          <div className="text-4xl">🍔</div>
          <div className="font-display font-black text-lg uppercase">No hay pedidos en esta sección</div>
          <p className="text-xs text-gray-500 max-w-sm mx-auto font-semibold">
            {searchQuery
              ? 'No se encontraron pedidos que coincidan con la búsqueda.'
              : 'Cuando los clientes confirmen sus pedidos desde la web aparecerán aquí en vivo.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_whatsapp;
            const items = Array.isArray(order.items) ? order.items : [];
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border-4 border-black p-5 sm:p-6 shadow-brutal space-y-4 transition-all"
              >
                {/* Header: ID, Date, Status & Zone */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-xl bg-black text-white px-3 py-1 rounded-xl">
                      #{String(order.id).padStart(4, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-sm uppercase text-gray-800">
                          {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                        </span>
                        <span className="text-xs font-bold bg-brandYellow text-black px-2 py-0.5 rounded-md border border-black">
                          📍 {order.deliveryZone}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">
                        Pago: {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 font-display font-black text-xs uppercase shadow-sm ${cfg.badgeClass}`}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </span>

                    {/* Quick Ticket Modal Opener */}
                    <button
                      type="button"
                      onClick={() => setSelectedTicketOrder(order)}
                      title="Ver Comanda / Ticket de Cocina"
                      className="bg-brandPillBg hover:bg-black hover:text-white transition px-2.5 py-1 rounded-full border-2 border-black text-xs font-bold cursor-pointer"
                    >
                      🧾 Ticket
                    </button>
                  </div>
                </div>

                {/* Customer & Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold bg-brandPillBg/60 p-3.5 rounded-2xl border-2 border-black/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-500 uppercase text-[10px]">Cliente:</span>
                      <span className="font-black text-sm text-black">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-500 uppercase text-[10px]">Teléfono:</span>
                      <span className="font-mono font-bold text-black">{order.customerPhone}</span>
                      <a
                        href={formatWhatsAppLink(order.customerPhone, order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full border border-black shadow-sm uppercase inline-flex items-center gap-1 transition"
                      >
                        <span>💬 WhatsApp</span>
                      </a>
                    </div>
                    {order.customerEmail && order.customerEmail !== 'sin-email@pepitos.local' && (
                      <div className="text-gray-600 text-[11px]">
                        ✉️ {order.customerEmail}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div>
                      <span className="font-bold text-gray-500 uppercase text-[10px]">Dirección:</span>
                      <p className="font-semibold text-gray-900">{order.deliveryAddress}</p>
                    </div>
                    {order.referencePoint && (
                      <div className="text-brandBlue font-bold text-[11px]">
                        📍 Ref / Nota: {order.referencePoint}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                    Platos Ordenados ({items.length}):
                  </div>
                  <div className="divide-y-2 divide-black/10">
                    {items.map((it, idx) => (
                      <div key={idx} className="py-2 flex items-start justify-between gap-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-brandYellow border border-black flex items-center justify-center font-display font-black text-xs">
                              {it.quantity}
                            </span>
                            <span className="font-display font-black text-sm uppercase">
                              {it.name}
                            </span>
                            {it.size && (
                              <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-black">
                                {it.size}
                              </span>
                            )}
                          </div>

                          {/* Modifiers & Sauces */}
                          {Array.isArray(it.modifiers) && it.modifiers.length > 0 && (
                            <div className="text-[11px] text-gray-600 pl-7 space-y-0.5">
                              {it.modifiers.map((m, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="inline-block bg-white text-gray-800 px-1.5 py-0.5 rounded border border-black/20 mr-1 text-[10px] font-bold"
                                >
                                  + {m.optionName} {m.priceDelta > 0 && `(+$${m.priceDelta.toFixed(2)})`}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="font-display font-black text-sm text-brandBlue">
                            ${(Number(it.lineTotal) || (it.unitPrice * it.quantity)).toFixed(2)}
                          </div>
                          <span className="text-[10px] text-gray-500 font-bold">
                            (${it.unitPrice.toFixed(2)} c/u)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Action Buttons Footer */}
                <div className="pt-3 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-gray-600">Total a Cobrar:</span>
                    <span className="font-display font-black text-2xl text-black bg-brandYellow px-3 py-1 rounded-xl border-2 border-black shadow-sm">
                      ${Number(order.total).toFixed(2)}
                    </span>
                    {Number(order.deliveryFee) > 0 && (
                      <span className="text-[11px] font-bold text-gray-500">
                        (Incluye delivery: ${Number(order.deliveryFee).toFixed(2)})
                      </span>
                    )}
                  </div>

                  {/* Actions / Status Transition Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Next Workflow Button */}
                    {cfg.nextStatus && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleStatusChange(order.id, cfg.nextStatus!)}
                        className="bg-black hover:bg-brandBlue text-white font-display font-black text-xs px-4 py-2 rounded-full border-2 border-black shadow-brutal transition cursor-pointer disabled:opacity-60 flex items-center gap-1.5 uppercase"
                      >
                        {isUpdating && <span className="animate-spin">⏳</span>}
                        <span>{cfg.nextLabel}</span>
                      </button>
                    )}

                    {/* Change to Any Status Dropdown */}
                    <div className="relative inline-block">
                      <select
                        disabled={isUpdating}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-white border-2 border-black rounded-full px-3 py-1.5 text-xs font-bold uppercase shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-brandBlue"
                      >
                        <option value="pending_whatsapp">⚡ A la Mano (Nuevo)</option>
                        <option value="in_preparation">👨‍🍳 En Preparación</option>
                        <option value="ready_to_dispatch">🛵 Por Despachar</option>
                        <option value="dispatched">🚚 En Camino</option>
                        <option value="delivered">✅ Entregado</option>
                        <option value="cancelled">❌ Cancelar Pedido</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket / Kitchen Receipt Modal */}
      {selectedTicketOrder && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border-4 border-black shadow-brutal-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto font-mono">
            <div className="flex justify-between items-center border-b-2 border-black pb-3">
              <div>
                <h3 className="font-display font-black text-lg uppercase font-sans">Comanda de Cocina</h3>
                <span className="text-xs font-bold text-gray-600">Orden #{String(selectedTicketOrder.id).padStart(4, '0')}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicketOrder(null)}
                className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black hover:bg-black hover:text-white transition cursor-pointer font-sans"
              >
                ✕
              </button>
            </div>

            <div className="text-center border-b-2 border-dashed border-black pb-3 space-y-1">
              <div className="font-black text-base font-sans">🌭 PEPITOS HOUSE 251 🌭</div>
              <div className="text-[11px] font-bold">Auténtico Sabor Guaro</div>
              <div className="text-[10px] text-gray-600">
                {formatDate(selectedTicketOrder.createdAt)} • {formatTime(selectedTicketOrder.createdAt)}
              </div>
            </div>

            <div className="text-xs space-y-1 border-b-2 border-dashed border-black pb-3">
              <div><strong>CLIENTE:</strong> {selectedTicketOrder.customerName}</div>
              <div><strong>TELÉFONO:</strong> {selectedTicketOrder.customerPhone}</div>
              <div><strong>ZONA:</strong> {selectedTicketOrder.deliveryZone}</div>
              <div><strong>DIRECCIÓN:</strong> {selectedTicketOrder.deliveryAddress}</div>
              {selectedTicketOrder.referencePoint && (
                <div><strong>REF/NOTA:</strong> {selectedTicketOrder.referencePoint}</div>
              )}
            </div>

            <div className="space-y-2 border-b-2 border-dashed border-black pb-3">
              <div className="text-xs font-bold uppercase font-sans">Detalle para Cocina:</div>
              {selectedTicketOrder.items.map((it, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>{it.quantity}x {it.name} {it.size ? `(${it.size})` : ''}</span>
                    <span>${(it.unitPrice * it.quantity).toFixed(2)}</span>
                  </div>
                  {Array.isArray(it.modifiers) && it.modifiers.map((m, mIdx) => (
                    <div key={mIdx} className="text-[11px] text-gray-700 pl-4">
                      • {m.optionName}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center font-black text-sm">
              <span>TOTAL A COBRAR:</span>
              <span className="font-sans text-lg">${Number(selectedTicketOrder.total).toFixed(2)}</span>
            </div>

            <div className="flex gap-2 pt-2 font-sans">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-black text-white font-display font-black py-2.5 rounded-full border-2 border-black uppercase text-xs hover:bg-brandBlue transition cursor-pointer"
              >
                🖨️ Imprimir Ticket
              </button>
              <button
                type="button"
                onClick={() => setSelectedTicketOrder(null)}
                className="bg-brandPillBg font-display font-black px-5 py-2.5 rounded-full border-2 border-black uppercase text-xs hover:bg-gray-200 transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
