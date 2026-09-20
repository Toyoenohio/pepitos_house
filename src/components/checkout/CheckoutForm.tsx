import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cart, $cartSubtotal, clearCart } from '../../stores/cartStore';
import { checkRestaurantOpen } from '../../lib/availability';
import { generateWhatsAppUrl, type CustomerData } from '../../lib/whatsapp';

export default function CheckoutForm() {
  const [mounted, setMounted] = useState(false);
  const cart = useStore($cart);
  const subtotal = useStore($cartSubtotal);
  const items = mounted ? Object.values(cart).filter(Boolean) : [];

  const [schedule, setSchedule] = useState(checkRestaurantOpen());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    phone: '',
    email: '',
    zone: 'Barcelona',
    address: '',
    reference: '',
    paymentMethod: 'Pago Móvil (Tasa BCV)',
    notes: ''
  });

  useEffect(() => {
    setMounted(true);
    setSchedule(checkRestaurantOpen());
    // Load saved email or data from localStorage if available
    try {
      const savedEmail = localStorage.getItem('ph251_member_email');
      const savedName = localStorage.getItem('ph251_member_name');
      const savedPhone = localStorage.getItem('ph251_member_phone');
      if (savedEmail || savedName || savedPhone) {
        setFormData(prev => ({
          ...prev,
          email: savedEmail || prev.email,
          name: savedName || prev.name,
          phone: savedPhone || prev.phone,
        }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Verify hours strictly
    const currentSchedule = checkRestaurantOpen();
    if (!currentSchedule.isOpen) {
      setErrorMessage(`Local cerrado. ${currentSchedule.message} ${currentSchedule.nextOpeningMessage}`);
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Tu carrito está vacío. Agrega productos antes de ordenar.');
      return ;
    }

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage('Por favor completa todos los campos obligatorios (Nombre, Teléfono, Dirección).');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Ingresa tu correo para registrar y acumular tu sello de membresía.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to localStorage for future pre-fill
      localStorage.setItem('ph251_member_email', formData.email);
      localStorage.setItem('ph251_member_name', formData.name);
      localStorage.setItem('ph251_member_phone', formData.phone);

      // 2. Send order to backend for stamps & storage
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items,
          subtotal,
          deliveryFee: 0,
          total: subtotal
        })
      });

      // 3. Open WhatsApp
      const waUrl = generateWhatsAppUrl(formData, items, subtotal, 0);
      clearCart();
      window.location.href = waUrl;
    } catch (err) {
      console.error('Failed to save order', err);
      // Even if database fails, don't block the customer's WhatsApp send!
      const waUrl = generateWhatsAppUrl(formData, items, subtotal, 0);
      clearCart();
      window.location.href = waUrl;
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 p-8 bg-white rounded-3xl border-4 border-black shadow-brutal-lg">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display font-black text-2xl uppercase">Tu Bolsa Está Vacía</h2>
        <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto">
          Parece que aún no has elegido tu pepito guaro. ¡Ve al menú y agrégalo en un solo click!
        </p>
        <a 
          href="/menu" 
          className="inline-block mt-6 bg-brandYellow hover:bg-black hover:text-white transition text-black font-display font-black px-6 py-3 rounded-full border-2 border-black shadow-brutal uppercase text-sm"
        >
          🔵 Ver Menú 251
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Shopify Style 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Checkout Form (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          

          {/* Closed Banner if outside hours */}
          {!schedule.isOpen && (
            <div className="bg-red-500 text-white p-5 rounded-2xl border-4 border-black shadow-brutal space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⏰</span>
                <div>
                  <h3 className="font-display font-black text-lg uppercase">Local Cerrado por Hoy</h3>
                  <p className="text-xs">{schedule.message}</p>
                </div>
              </div>
              <div className="text-xs bg-black/20 p-2.5 rounded-xl font-semibold">
                ⏰ {schedule.nextOpeningMessage}  
                <br/>Web activa para consultar menú y tarjeta de sellos, despachos de 3pm a 10pm.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 rounded-3xl border-4 border-black shadow-brutal space-y-6">
            
            {/* Step 1: Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brandYellow border-2 border-black flex items-center justify-center font-display font-black text-xs">1</span>
                <h3 className="font-display font-black text-base uppercase">Datos del Cliente</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider mb-1">Nombre y Apellido *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    autoComplete="name"
                    required
                    placeholder="Ej. Carlos Martínez"
                    className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider mb-1">Teléfono (WhatsApp) *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    autoComplete="tel"
                    required
                    placeholder="0424-1234567"
                    className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-black uppercase tracking-wider">Correo Electrónico (Para tu Tarjeta de Sellos) *</label>
                  <span className="text-[10px] font-bold text-brandBlue">10 Sellos = 1 Pepito Gratis</span>
                </div>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
                />
              </div>
            </div>

            {/* Step 2: Delivery */}
            <div className="space-y-3 pt-2 border-t-2 border-black/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brandYellow border-2 border-black flex items-center justify-center font-display font-black text-xs">2</span>
                <h3 className="font-display font-black text-base uppercase">Dirección de Entrega (Anzoátegui)</h3>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1">Zona o Ciudad *</label>
                <select 
                  name="zone" 
                  value={formData.zone} 
                  onChange={handleInputChange}
                  className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brandBlue"
                >
                  <option value="Barcelona">Barcelona (Centro, Nueva Barcelona, Colinas, etc.)</option>
                  <option value="Lechería">Lechería (Av. Principal, Cerro El Morro, Peñon del Faro)</option>
                  <option value="Puerto La Cruz">Puerto La Cruz (Paseo Colón, Pozuelos, Av. Municipal)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1">Dirección Exacta (Calle, Edificio/Casa, N° de apto) *</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  required
                  placeholder="Ej. Urb. Nueva Barcelona, Calle 4, Quinta San Juan"
                  className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider mb-1">Punto de Referencia (opcional)</label>
                <input 
                  type="text" 
                  name="reference" 
                  value={formData.reference} 
                  onChange={handleInputChange}
                  placeholder="Ej. Frente al farmatodo, casa blanca con rejas negras"
                  className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
                />
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="space-y-3 pt-2 border-t-2 border-black/10">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brandYellow border-2 border-black flex items-center justify-center font-display font-black text-xs">3</span>
                <h3 className="font-display font-black text-base uppercase">Método de Pago</h3>
              </div>

              <div className="space-y-2">
                {[
                  'Pago Móvil (Tasa BCV)',
                  'Zelle',
                  'Dólares Efectivo (USD)',
                  'Punto de Venta en Delivery'
                ].map((pay) => (
                  <label 
                    key={pay}
                    className={"flex items-center justify-between p-3 border-2 border-black rounded-xl cursor-pointer transition " + 
                      (formData.paymentMethod === pay ? 'bg-brandYellow shadow-brutal' : 'bg-white hover:bg-brandYellow/40')}
                  >
                    <span className="flex items-center gap-2.5">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={pay} 
                        checked={formData.paymentMethod === pay}
                        onChange={handleInputChange}
                        className="accent-black w-4 h-4"
                      />
                      <span className="text-xs font-bold">{pay}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider mb-1">Instrucciones especiales de cocina o entrega (opcional)</label>
              <textarea 
                name="notes" 
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ej. Salcita tártara aparte, full pecorino, tocar timbre al llegar..."
                rows={2}
                className="w-full bg-brandPillBg border-2 border-black rounded-xl py-2.5 px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue"
              />
            </div>

            {errorMessage && (
              <div className="bg-red-100 border-2 border-red-600 text-red-800 p-3 rounded-xl text-xs font-bold">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting || !schedule.isOpen}
                className={"web-btn w-full py-4 px-6 rounded-full border-4 border-black font-display font-black text-base sm:text-lg uppercase tracking-wider shadow-brutal transition-all flex items-center justify-center gap-3 " +
                  (!schedule.isOpen ? 'bg-gray-400 text-white cursor-not-allowed' : 'hover:bg-brandBlueDark bg-brandBlue text-white')}
              >
                {schedule.isOpen ? (
                  <>
                    <span>📲 ENVIAR PEDIDO AL WHATSAPP</span>
                    <span className="bg-brandYellow text-black px-2.5 py-0.5 rounded-full border border-black text-sm">
                      ${subtotal.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>LOCAL CERRADO (JORNADA 3:00 PM - 10:00 PM)</span>
                )}
              </button>
              <p className="text-[10px] text-center font-bold text-gray-500 uppercase tracking-widest mt-2">
                📦 Tu pedido se enviará directo a WhatsApp para armarlo de una vez
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-40 bg-white rounded-3xl border-4 border-black shadow-brutal overflow-hidden">
            <div className="bg-brandYellow border-b-2 border-black p-4 flex items-center justify-between">
              <h3 className="font-display font-black text-lg uppercase">Resumen del Pedido</h3>
              <span className="bg-black text-white text-xs px-2.5 py-1 rounded-full font-display font-black">
                {items.reduce((a, b) => a + b.quantity, 0)} platos
              </span>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto bg-brandCream">
              {items.map((item) => {
                const itemTotal = (item.unitPrice * item.quantity).toFixed(2);
                const extras = item.modifiers.filter(m => m.groupId !== 'size');

                return (
                  <div key={item.id} className="bg-white p-3 rounded-xl border-2 border-black flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full border-2 border-black object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-black text-xs uppercase truncate">{item.name}</h4>
                      <div className="text-[10px] text-gray-600 font-bold">
                        {item.size && <span>{item.size} | </span>}
                        <span>Cant: {item.quantity}</span>
                      </div>
                      {extras.length > 0 && (
                        <div className="text-[9px] text-brandBlue font-bold truncate">
                          + {extras.map(e => e.optionName).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="font-black text-sm text-black">
                      ${itemTotal}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-5 bg-white border-t-2 border-black space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-600">Delivery (Anzoátegui)</span>
                <span className="text-emerald-700 font-extrabold">GRATIS (Promo)</span>
              </div>

              <div className="flex justify-between text-xl font-display font-black text-black pt-3 border-t border-black/20">
                <span>TOTAL:</span>
                <span className="text-brandBlue font-black">${subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-4 bg-brandYellow/50 p-3 rounded-xl border-2 border-black flex items-center gap-2.5">
                <span className="text-2xl">🎟️</span>
                <div className="text-[10px] font-bold leading-tight">
                  ¡Este pedido sumará 1 sello en tu tarjeta de membresía con el correo indicado!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
