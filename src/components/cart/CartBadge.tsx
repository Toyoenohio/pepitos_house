import React from 'react';
import { useStore } from '@nanostores/react';
import { $cartCount } from '../../stores/cartStore';

export default function CartBadge() {
  const count = useStore($cartCount);

  function openCart() {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) {
      drawer.classList.remove('translate-x-full');
    }
  }

  return (
    <button 
      onClick={openCart}
      aria-label="Abrir carrito de pedidos"
      className="bg-white text-black px-3.5 py-1.5 rounded-full border-2 border-black font-display font-extrabold text-sm shadow-brutal hover:bg-black hover:text-white transition-all flex items-center gap-2"
    >
      <svg className="w-4 -h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M989h14l1 12H4DL5 9z"></path>
      </svg>
      <span className="bg-brandBlue text-white text-xs px-2 py-0.5 rounded-full border border-black font-sans">
        {count}
      </span>
    </button>
  );
}
