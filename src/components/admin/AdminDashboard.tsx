import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { INITIAL_PRODUCTS, type MenuItem } from '../../lib/productsData';
import { 
  $productOverrides, 
  toggleProduct86, 
  toggleProductDay, 
  getEffectiveProduct 
} from '../../stores/availabilityStore';

export default function AdminDashboard({ initialOverrides = {} }: { initialOverrides?: Record<string, { isAvailable: boolean; availableDays: string[] }> }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [syncError, setSyncError] = useState('');
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  const overrides = useStore($productOverrides);
  const [extraProducts, setExtraProducts] = useState<MenuItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ph251_extra_products');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [newItemModal, setNewItemModal] = useState(false);
  const [newItemForm, setNewItemForm] = useState<Partial<MenuItem>>({
    name: '',
    category: 'pepitos',
    price: 10.00,
    badgeType: 'Especial',
    highlight: 'NUEVO',
    stats: '🌭 30cm • Lomito',
    description: '',
    dressing: 'Salsa tártara de la casa',
    image: 'https://images.unsplash.com/photo-1627042633706-0150c1800752?auto=format&fit=crop&w=800&q=80',
    bgAccent: 'bg-brandBlue',
    isAvailable: true,
    availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
  });

  useEffect(() => {
    setMounted(true);
    // La sesión vive en una cookie HttpOnly firmada por el servidor: el navegador
    // no puede leerla ni falsificarla, y la contraseña ya no viaja en el bundle.
    $productOverrides.set(initialOverrides || {});
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setIsAuthenticated(!!d?.authenticated);
        if (!d?.configured) setAuthError('El panel no está configurado: falta ADMIN_PASSWORD en el entorno.');
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  // La contraseña se valida en el servidor contra ADMIN_PASSWORD del entorno.
  // Acá ya no hay ninguna clave: antes estaba escrita en este archivo, que se
  // compila y se sirve al navegador (y el repo es público).
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setAuthError('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || 'No se pudo entrar.');
      setIsAuthenticated(true);
      setPasswordInput('');
      $productOverrides.set(initialOverrides || {});
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Contraseña incorrecta. Inténtalo nuevamente.');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    try { await fetch('/api/admin/logout', { method: 'POST' }); } catch { /* sin sesión igual se sale */ }
    setIsAuthenticated(false);
    setPasswordInput('');
  }

  /** Manda el cambio al servidor (Neon). Antes solo se guardaba en este navegador,
   *  así que el cliente creía que había apagado un plato y los visitantes seguían
   *  viéndolo disponible. Si el guardado falla, se avisa: no se puede mentir.
   */
  async function persistOverride(productId: string) {
    const o = $productOverrides.get()[productId];
    if (!o) return;
    setSyncError('');
    try {
      const r = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, isAvailable: o.isAvailable, availableDays: o.availableDays }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) setSyncError(d?.error || 'No se pudo guardar el cambio.');
    } catch {
      setSyncError('Sin conexión: el cambio no se guardó en el servidor.');
    }
  }

  function handleCreateItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemForm.name || !newItemForm.description) return;
    const newId = 'prod-' + Date.now();
    const created: MenuItem = {
      id: newId,
      name: newItemForm.name!,
      category: newItemForm.category || 'pepitos',
      price: Number(newItemForm.price) || 10.00,
      badgeType: newItemForm.badgeType || 'Clásico',
      highlight: newItemForm.highlight || 'RECOMENDADO',
      stats: newItemForm.stats || '🌭 30cm • Lomito',
      description: newItemForm.description!,
      dressing: newItemForm.dressing || 'Salsa tártara de la casa',
      image: newItemForm.image || 'https://images.unsplash.com/photo-1627042633706-0150c1800752?auto=format&fit=crop&w=800&q=80',
      bgAccent: newItemForm.bgAccent || 'bg-brandBlue',
      isAvailable: true,
      availableDays: newItemForm.availableDays || ['thu', 'fri', 'sat', 'sun', 'mon']
    };

    const updated = [created, ...extraProducts];
    setExtraProducts(updated);
    try {
      localStorage.setItem('ph251_extra_products', JSON.stringify(updated));
    } catch {}

    setNewItemModal(false);
    setNewItemForm({
      name: '',
      category: 'pepitos',
      price: 10.00,
      badgeType: 'Especial',
      highlight: 'NUEVO',
      stats: '🌭 30cm • Lomito',
      description: '',
      dressing: 'Salsa tártara de la casa',
      image: 'https://images.unsplash.com/photo-1627042633706-0150c1800752?auto=format&fit=crop&w=800&q=80',
      bgAccent: 'bg-brandBlue',
      isAvailable: true,
      availableDays: ['thu', 'fri', 'sat', 'sun', 'mon']
    });
  }

  if (!mounted) {
    return (
      <div className="py-20 text-center font-display font-black text-xl uppercase">
        Cargando Panel...
      </div>
    );
  }

  // Auth Gate Screen
  if (!isAuthenticated) {
    if (checking) {
      return (
        <div className="flex items-center justify-center py-24 text-black font-display font-black uppercase animate-pulse">
          Verificando sesión…
        </div>
      );
    }
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border-4 border-black shadow-brutal-lg space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl">🔒</span>
          <h2 className="font-display font-black text-2xl uppercase">Acceso Administrativo</h2>
          <p className="text-xs text-gray-600 font-semibold">
            Ingresa la contraseña de administración para gestionar el catálogo y la disponibilidad de Pepitos House 251.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase mb-1">Contraseña</label>
            <input 
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
            />
          </div>

          {authError && (
            <div className="p-2.5 bg-red-100 border-2 border-red-600 text-red-800 text-xs font-bold rounded-xl">
              ⚠️ {authError}
            </div>
          )}

          <button 
            type="submit"
            disabled={busy}
            className="w-full bg-brandYellow hover:bg-black hover:text-white transition text-black font-display font-black py-3 rounded-full border-2 border-black shadow-brutal uppercase text-sm cursor-pointer disabled:opacity-60"
          >
            {busy ? "Entrando…" : "Entrar al Panel"}
          </button>
        </form>
      </div>
    );
  }

  // Merge base and custom products with real-time overrides
  const allProducts = [...extraProducts, ...INITIAL_PRODUCTS].map(p => getEffectiveProduct(p, overrides));
  const activeCount = allProducts.filter(p => p.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Admin Top Banner */}
      <div className="bg-black text-white p-6 rounded-3xl border-4 border-black shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌭</span>
            <h1 className="font-display font-black text-2xl uppercase">Panel Administrativo 251</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Control en vivo de platos, switches de disponibilidad (86) y configuración por días.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNewItemModal(true)}
            className="bg-brandYellow text-black font-display font-black text-xs px-5 py-2.5 rounded-full border-2 border-black shadow-brutal hover:bg-white transition uppercase cursor-pointer"
          >
            + NUEVO PLATO
          </button>
          <button 
            onClick={handleLogout}
            className="bg-white text-black font-display font-black text-xs px-4 py-2.5 rounded-full border-2 border-black shadow-brutal hover:bg-red-500 hover:text-white transition uppercase cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>

      {syncError && (
        <div role="alert" className="bg-red-100 border-2 border-red-600 text-red-800 font-display font-black text-xs px-4 py-3 rounded-2xl uppercase">
          ⚠️ {syncError} — el cambio no se guardó en el servidor.
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-brutal">
          <span className="text-xs font-bold text-gray-600 uppercase">Total Platos</span>
          <div className="font-display font-black text-3xl">{allProducts.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-brutal">
          <span className="text-xs font-bold text-gray-600 uppercase">Platos Activos</span>
          <div className="font-display font-black text-3xl text-emerald-600">
            {activeCount}
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border-3 border-black shadow-brutal">
          <span className="text-xs font-bold text-gray-600 uppercase">Horario de Despacho</span>
          <div className="font-display font-black text-xl">
            Jue-Lun (3:00 PM - 10:00 PM)
          </div>
        </div>
      </div>

      {/* Products List & Management */}
      <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-brutal space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-display font-black text-xl uppercase">Catálogo de Platos</h3>
          <span className="text-xs font-bold text-gray-600">Los cambios se aplican de inmediato en la web.</span>
        </div>

        <div className="space-y-4">
          {allProducts.map((prod) => (
            <div 
              key={prod.id} 
              className={`${prod.isAvailable ? 'bg-white' : 'bg-gray-100 opacity-75'} rounded-2xl border-2 border-black p-4 shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              <div className="flex items-center gap-3.5">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-16 h-16 rounded-xl border-2 border-black object-cover flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-black text-base uppercase">{prod.name}</h4>
                    <span className="bg-brandPillBg text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-black uppercase">
                      {prod.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-semibold max-w-md truncate">
                    {prod.description}
                  </p>
                  <div className="font-black text-sm text-brandBlue mt-0.5">
                    ${prod.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                {/* Days Selector */}
                <div className="flex items-center gap-1">
                  {[
                    { k: 'thu', l: 'J' },
                    { k: 'fri', l: 'V' },
                    { k: 'sat', l: 'S' },
                    { k: 'sun', l: 'D' },
                    { k: 'mon', l: 'L' }
                  ].map(({ k, l }) => {
                    const hasDay = prod.availableDays?.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => { toggleProductDay(prod.id, k); persistOverride(prod.id); }}
                        title={`Activar/Desactivar día ${l}`}
                        className={`aspect-square w-7 h-7 rounded-full border-2 border-black font-display font-black text-[11px] transition cursor-pointer ${hasDay ? 'bg-brandYellow text-black' : 'bg-white text-gray-400'}`}
                      >
                        {l}
                      </button>
                    );
                  })}
                </div>

                {/* Switch 86d Toggle */}
                <button 
                  type="button"
                  onClick={() => { toggleProduct86(prod.id, prod.isAvailable); persistOverride(prod.id); }}
                  className={`px-3.5 py-1.5 rounded-full border-2 border-black font-display font-black text-xs uppercase shadow-brutal transition cursor-pointer ${prod.isAvailable ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  {prod.isAvailable ? '🟢 ACTIVO' : '⛔ APAGADO (86)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Item Modal */}
      {newItemModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border-4 border-black shadow-brutal-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b-2 border-black pb-3">
              <h3 className="font-display font-black text-xl uppercase">Crear Nuevo Plato</h3>
              <button 
                type="button"
                onClick={() => setNewItemModal(false)}
                className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-black hover:bg-black hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase mb-1">Nombre del Plato</label>
                <input 
                  type="text" 
                  required
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2 px-3 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase mb-1">Categoría</label>
                  <select 
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2 px-3 text-sm font-bold"
                  >
                    <option value="pepitos">Pepitos</option>
                    <option value="burgers">Hamburguesas</option>
                    <option value="papas">Papas</option>
                    <option value="ensaladas">Ensaladas</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1">Precio (USD)</label>
                  <input 
                    type="number" 
                    step="0.50"
                    required
                    value={newItemForm.price}
                    onChange={(e) => setNewItemForm(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2 px-3 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase mb-1">Descripción de Ingredientes</label>
                <textarea 
                  required
                  value={newItemForm.description}
                  onChange={(e) => setNewItemForm(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2 px-3 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase mb-1">URL de la Imagen</label>
                <input 
                  type="text" 
                  value={newItemForm.image}
                  onChange={(e) => setNewItemForm(p => ({ ...p, image: e.target.value }))}
                  className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-brandBlue text-white font-display font-black py-3 rounded-full border-2 border-black shadow-brutal uppercase text-sm cursor-pointer hover:bg-brandBlueDark transition"
              >
                GUARDAR EN MENÚ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

