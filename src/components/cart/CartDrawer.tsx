import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $cart, $cartSubtotal, updateItemQuantity, removeItemFromCart } from '../../stores/cartStore';
import { checkRestaurantOpen } from '../../lib/availability';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cart = useStore($cart);
  const subtotal = useStore($cartSubtotal);
  const [schedule, setSchedule] = useState(checkRestaurantOpen());

  useEffect(() => {
    setMounted(true);
    setSchedule(checkRestaurantOpen());

    function handleOpenCart() {
      setIsOpen(true);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('ph251_open_cart', handleOpenCart);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('ph251_open_cart', handleOpenCart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Lock document scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function closeCart() {
    setIsOpen(false);
  }

  const items = mounted ? Object.values(cart).filter(Boolean) : [];
  const currentSubtotal = mounted ? subtotal : 0;

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer Panel */}
      <div 
        id="cartDrawer" 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white border-l-4 border-black z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-brandYellow border-b-2 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌭</span>
            <h2 className="font-display font-black text-xl uppercase tracking-tight">Tu Pedido Guaro</h2>
          </div>
          <button 
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-1.5 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Shop status alert */}
        {!schedule.isOpen && (
          <div className="bg-red-500 text-white px-3 py-2 text-xs font-bold flex items-center gap-2 border-b-2 border-black">
            <span>⏰</span>
            <div>
              <span className="font-extrabold uppercase">Local Cerrado:</span> {schedule.message} 
              <span className="underline ml-1">{schedule.nextOpeningMessage}</span>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brandCream">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-5xl">🛒</div>
              <div className="font-display font-black text-lg uppercase">¡Tu bolsa está vacía!</div>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">
                Elige tu pepito guaro favorito con full pecorino y agrégalo aquí.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const itemTotal = (item.unitPrice * item.quantity).toFixed(2);
              const extras = item.modifiers.filter(m => m.groupId !== 'size');

              return (
                <div key={item.id} className="bg-white rounded-2xl border-2 border-black p-3 shadow-brutal flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-black overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-black text-xs uppercase truncate">{item.name}</h4>
                    <div className="text-[10px] text-gray-600 font-bold leading-tight">
                      {item.size && <span>Tamaño: {item.size}</span>}
                      {extras.length > 0 && (
                        <div className="text-brandBlue truncate">
                          + {extras.map(e => e.optionName).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="font-black text-xs text-black mt-0.5">${itemTotal}</div>
                  </div>
                  <div className="flex items-center border-2 border-black rounded-full bg-brandCream px-1.5 py-0.5">
                    <button 
                      onClick={() => updateItemQuantity(item.id, -1)} 
                      className="font-bold px-1.5 hover:text-brandBlue cursor-pointer"
                    >-</button>
                    <span className="text-xs font-black px-1">{item.quantity}</span>
                    <button 
                      onClick={() => updateItemQuantity(item.id, 1)} 
                      className="font-bold px-1.5 hover:text-brandBlue cursor-pointer"
                    >+</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-2 border-black space-y-3">
          <div className="space-y-1.5 text-xs font-bold border-b border-black/20 pb-2.5">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>${currentSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Anzoátegui:</span>
              <span className="text-emerald-700 font-extrabold">GRATIS (Promo)</span>
            </div>
            <div className="flex justify-between text-base font-display font-black text-black pt-1">
              <span>TOTAL:</span>
              <span>${currentSubtotal.toFixed(2)}</span>
            </div>
          </div>

          {!schedule.isOpen ? (
            <div className="text-center space-y-2">
              <button 
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-full border-2 border-black font-display font-black text-base uppercase tracking-wider cursor-not-allowed"
              >
                LOCAL CERRADO (JUE-LUN)
              </button>
              <p className="text-[10px] text-red-600 font-bold">
                No se pueden procesar pedidos fuera del horario (3pm-10pm).
              </p>
            </div>
          ) : (
            <a 
              href="/checkout"
              onClick={closeCart}
              className={`w-full bg-brandBlue text-white py-3 rounded-full border-2 border-black font-display font-black text-base uppercase tracking-wider shadow-brutal hover:bg-brandBlueDark transition flex items-center justify-center gap-2 ${items.length === 0 ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span>IR AL CHECKOUT</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H1"></path>
              </svg>
            </a>
          )}
          <p className="text-[10px] text-center font-bold text-gray-500 uppercase tracking-widest">
            Pago Móvil BCV &bull; Zelle &bull; Efectivo USD
          </p>
        </div>
      </div>
    </>
  );
}

