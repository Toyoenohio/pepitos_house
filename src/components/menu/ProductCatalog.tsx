import React, { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import type { MenuItem, Category } from '../../lib/productsData';
import { addItemToCart } from '../../stores/cartStore';
import { $productOverrides, getEffectiveProduct } from '../../stores/availabilityStore';
import { isItemAvailableToday } from '../../lib/availability';
import ProductModal from './ProductModal';

interface Props {
  products: MenuItem[];
  categories: Category[];
}

export default function ProductCatalog({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const overrides = useStore($productOverrides);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  }

  // Merge products with real-time admin availability overrides
  const effectiveProducts = useMemo(() => {
    return products.map(p => getEffectiveProduct(p, overrides));
  }, [products, overrides]);

  const filteredProducts = useMemo(() => {
    return effectiveProducts.filter(p => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.stats.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [effectiveProducts, selectedCategory, searchQuery]);

  function quickAdd(prod: MenuItem, isAvailableNow: boolean) {
    if (!isAvailableNow) return;

    // If has options or sizes, prefer opening modal
    if (prod.category === 'pepitos') {
      setSelectedProduct(prod);
      return;
    }

    addItemToCart({
      id: prod.id,
      productId: prod.id,
      name: prod.name,
      basePrice: prod.price,
      unitPrice: prod.price,
      quantity: 1,
      image: prod.image,
      modifiers: []
    });

    showToast(`¡Agregado!: ${prod.name}`);
    window.dispatchEvent(new CustomEvent('ph251_open_cart'));
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <span className="inline-block bg-white text-black text-[11px] font-extrabold px-3 py-0.5 rounded-full border-2 border-black mb-2 shadow-brutal uppercase tracking-wider">
            🔵 Auténtico Sabor Guaro en Anzoátegui
          </span>
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-none">
            Menú 251
          </h1>
        </div>
        <div className="text-sm font-semibold text-black/80 max-w-md">
          Especialistas en pepitos guaros monumentales, carne tierna a la plancha, queso pecorino y salsas caseras. Delivery en Barcelona, Lechería y Puerto La Cruz.
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar pepito de lomito, salsa de maíz dulce, papas, hamburguesa..."
          className="w-full bg-white border-2 border-black rounded-full py-2.5 pl-11 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-brandBlue shadow-brutal"
        />
        <svg className="w-5 h-5 text-gray-700 absolute left-4 top-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2 rounded-full border-2 border-black font-display font-extrabold text-sm uppercase tracking-wide whitespace-nowrap shadow-brutal transition-all ${selectedCategory === 'all' ? 'bg-black text-white' : 'bg-white text-black hover:bg-brandYellowDark'}`}
        >
          Todos ({products.length})
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-5 py-2 rounded-full border-2 border-black font-display font-extrabold text-sm uppercase tracking-wide whitespace-nowrap shadow-brutal transition-all flex items-center gap-1.5 ${selectedCategory === cat.slug ? 'bg-black text-white' : 'bg-white text-black hover:bg-brandYellowDark'}`}
          >
            <span>{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Count */}
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-black/70">
        <span>Mostrando {filteredProducts.length} delicias guaras</span>
      </div>

      {/* Products Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border-4 border-black p-6 shadow-brutal">
            <span className="text-4xl">🔍</span>
            <h3 className="font-display font-black text-xl uppercase mt-2">No encontramos ese producto</h3>
            <p className="text-xs text-gray-600 mt-1">Prueba buscando "pepito", "lomito", "queso" o "papas".</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} 
              className="mt-4 bg-black text-white text-xs font-display font-bold px-4 py-2 rounded-full border-2 border-black uppercase shadow-brutal cursor-pointer"
            >
              Ver todo el menú
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isAvailableNow = product.isAvailable && isItemAvailableToday(product.availableDays);

            return (
              <article 
                key={product.id} 
                className={`bg-white rounded-3xl border-3 border-black overflow-hidden shadow-brutal hover:shadow-brutal-lg transition-all flex flex-col justify-between ${!isAvailableNow ? 'opacity-70' : ''}`}
              >
                {/* Top Media Block */}
                <div className={`${product.bgAccent} p-5 relative border-b-2 border-black flex flex-col items-center justify-center`}>
                  <div className="w-full flex items-center justify-between z-10">
                    <button 
                      onClick={() => isAvailableNow && setSelectedProduct(product)} 
                      disabled={!isAvailableNow}
                      className={`text-[10px] font-display font-black px-2.5 py-1 rounded-full border border-black shadow-brutal uppercase tracking-wider flex items-center gap-1 ${isAvailableNow ? 'bg-black text-white hover:bg-white hover:text-black cursor-pointer' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                    >
                      <span>INFO</span>
                      <span className="text-brandYellow font-extrabold">+</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {!isAvailableNow && (
                        <span className="bg-red-600 text-white font-display font-black text-[9px] px-2.5 py-0.5 rounded-full border-2 border-black shadow-brutal uppercase tracking-wide">
                          AGOTADO HOY
                        </span>
                      )}
                      <span className="bg-white text-black font-display font-black text-[10px] px-3 py-0.5 rounded-full border-2 border-black shadow-brutal uppercase italic tracking-wide">
                        {product.badgeType}
                      </span>
                    </div>
                  </div>

                  <div 
                    className={`relative my-2 ${isAvailableNow ? 'cursor-pointer group' : 'cursor-not-allowed'}`}
                    onClick={() => isAvailableNow && setSelectedProduct(product)}
                  >
                    <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full border-4 border-black bg-white overflow-hidden shadow-brutal p-1 transition-transform duration-300 group-hover:scale-105">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full group-hover:rotate-3 transition-transform duration-300"
                      />
                    </div>
                    <span className="auto absolute bottom-1 right-2 bg-brandYellow text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-black shadow-brutal">
                      {product.highlight}
                    </span>
                  </div>
                </div>

                {/* Bottom Content Block */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-brandCream">
                  <div>
                    <h3 
                      className={`font-display font-black text-lg md:text-xl uppercase tracking-tight text-black leading-snug ${isAvailableNow ? 'cursor-pointer hover:text-brandBlue' : ''} transition-colors`}
                      onClick={() => isAvailableNow && setSelectedProduct(product)}
                    >
                      {product.name}
                    </h3>

                    <div className="text-[11px] font-extrabold text-black/70 flex items-center gap-1.5 mt-1">
                      <span>{product.stats}</span>
                    </div>

                    <div className="mt-1 font-display font-black text-xl text-black">
                      ${product.price.toFixed(2)}
                    </div>

                    <p className="text-xs text-black/75 font-semibold leading-relaxed mt-2 line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-black/15 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-700">
                      <svg className="w-3.5 h-3.5 text-brandBlue flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      <span className="truncate">{product.dressing}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {isAvailableNow ? (
                        <>
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="flex-1 bg-white hover:bg-black hover:text-white transition text-black font-display font-black text-xs py-2 px-3 rounded-full border-2 border-black shadow-brutal uppercase text-center cursor-pointer"
                          >
                            Personalizar
                          </button>

                          <button 
                            onClick={() => quickAdd(product, true)}
                            aria-label="Agregar al carrito"
                            className="bg-black hover:bg-brandBlue text-white font-display font-black text-xs p-2 rounded-full border-2 border-black shadow-brutal transition-colors flex items-center justify-center cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div className="w-full bg-gray-300 text-gray-700 font-display font-black text-xs py-2 px-3 rounded-full border-2 border-gray-500 uppercase text-center cursor-not-allowed">
                          ⛔ Agotado por hoy
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Personalization Modal */}
      <ProductModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToast={showToast}
      />

      {/* Toast Feedback */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-5 py-2.5 rounded-full border-2 border-brandYellow shadow-brutal font-display font-extrabold text-xs uppercase tracking-wide transition-all duration-300 ${toastMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        {toastMessage}
      </div>
    </div>
  );
}

