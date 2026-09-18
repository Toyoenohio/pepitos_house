import React, { useState, useEffect } from 'react';
import type { MenuItem } from '../../lib/productsData';
import { CATEGORY_MODIFIERS } from '../../lib/productsData';
import { addItemToCart } from '../../stores/cartStore';
import type { CartItem, SelectedModifier } from '../../lib/whatsapp';

interface Props {
  product: MenuItem | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export default function ProductModal({ product, onClose, onToast }: Props) {
  if (!product) return null;

  const groups = CATEGORY_MODIFIERS[product.category] || [];
  const sizeGroup = groups.find(g => g.id === 'size');
  const extraGroups = groups.filter(g => g.id !== 'size');

  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    sizeGroup && sizeGroup.options.length > 0 ? sizeGroup.options[0].id : ''
  );
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [quantity, setQuantity] = useState(1);

  // Reset on product change
  useEffect(() => {
    if (sizeGroup && sizeGroup.options.length > 0) {
      setSelectedSizeId(sizeGroup.options[0].id);
    } else {
      setSelectedSizeId('');
    }
    setSelectedExtras({});
    setQuantity(1);
  }, [product.id]);

  // Calculate Prices
  const selectedSizeOption = sizeGroup?.options.find(o => o.id === selectedSizeId);
  const sizeDelta = selectedSizeOption ? selectedSizeOption.priceDelta : 0;

  let extrasDelta = 0;
  extraGroups.forEach(group => {
    group.options.forEach(opt => {
      if (selectedExtras[opt.id]) {
        extrasDelta += opt.priceDelta;
      }
    });
  });

  const unitPrice = product.price + sizeDelta + extrasDelta;
  const totalPrice = unitPrice * quantity;

  function handleAddToCart() {
    if (!product) return;
    const modifiers: SelectedModifier[] = [];

    if (selectedSizeOption) {
      modifiers.push({
        groupId: 'size',
        groupName: 'Tamaño',
        optionId: selectedSizeOption.id,
        optionName: selectedSizeOption.name,
        priceDelta: selectedSizeOption.priceDelta
      });
    }

    extraGroups.forEach(group => {
      group.options.forEach(opt => {
        if (selectedExtras[opt.id]) {
          modifiers.push({
            groupId: group.id,
            groupName: group.name,
            optionId: opt.id,
            optionName: opt.name,
            priceDelta: opt.priceDelta
          });
        }
      });
    });

    // Unique id based on product id + options
    const modKeys = modifiers.map(m => m.optionId).sort().join('-');
    const cartItemId = `${product.id}${modKeys ? '-' + modKeys : ''}`;

    const cartItem: CartItem = {
      id: cartItemId,
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      unitPrice,
      quantity,
      image: product.image,
      size: selectedSizeOption?.name,
      modifiers
    };

    addItemToCart(cartItem);
    onToast(`¡Agregado al pedido!: ${product.name}`);
    onClose();

    // Open cart automatically to show feedback
    const drawer = document.getElementById('cartDrawer');
    if (drawer) drawer.classList.remove('translate-x-full');
  }

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border-4 border-black shadow-brutal-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`${product.bgAccent} p-6 relative flex flex-col items-center justify-center text-center text-white border-b-4 border-black`}>
          <button 
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 bg-white text-black p-2 rounded-full border-2 border-black hover:bg-black hover:text-white transition shadow-brutal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {/* Plate Image */}
          <div className="w-32 h-32 rounded-full border-4 border-black bg-white shadow-brutal p-1 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-full" />
          </div>

          <div className="mt-3 flex gap-2">
            <span className="bg-brandYellow text-black font-display font-black text-xs px-3 py-0.5 rounded-full border-2 border-black shadow-brutal uppercase">
              {product.category.toUpperCase()}
            </span>
            <span className="bg-white text-black font-display font-extrabold text-xs px-3 py-0.5 rounded-full border-2 border-black shadow-brutal uppercase">
              {product.highlight}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-sans">
          <div className="flex justify-between items-first">
            <div>
              <h2 className="font-display font-black text-2xl uppercase tracking-tight">{product.name}</h2>
              <div className="text-xs font-bold text-gray-600 mt-1">{product.stats}</div>
            </div>
            <span className="font-display font-black text-2xl text-brandBlue">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Description */}
          <div className="bg-brandPillBg p-3.5 rounded-2xl border-2 border-black">
            <div className="text-[11px] font-black uppercase text-black/60 tracking-wider mb-1">INGREDIENTES DE LA CASA:</div>
            <p className="text-xs leading-relaxed font-semibold text-black/85">{product.description}</p>
          </div>

          {/* Size Group (if any) */}
          {sizeGroup && (
            <div className="space-y-1.5">
              <label className="block font-display font-bold text-xs uppercase tracking-wide">
                {sizeGroup.name}:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {sizeGroup.options.map((opt) => (
                  <label 
                    key={opt.id}
                    className={"border-2 border-black rounded-xl p-2 text-center cursor-pointer transition text-xs font-bold flex flex-col items-center " + 
                      (selectedSizeId === opt.id ? 'bg-brandYellow shadow-brutal' : 'hover:bg-brandYellow/40')}
                  >
                    <input 
                      type="radio" 
                      name="sizeOpt" 
                      value={opt.id} 
                      checked={unitPrice > 0 && selectedSizeId === opt.id}
                      onChange={() => setSelectedSizeId(opt.id)}
                      className="sr-only" 
                    />
                    <span>{opt.name}</span>
                    <span className="text-[10px] text-gray-600">
                      {opt.priceDelta > 0 ? `+$${opt.priceDelta.toFixed(2)}` : 'Incluido'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Extras Groups */}
          {extraGroups.map((group) => (
            <div key={group.id} className="space-y-1.5">
              <label className="block font-display font-bold text-xs uppercase tracking-wide">
                {group.name}:
              </label>
              <div className="space-y-1.5 text-xs font-semibold">
                {group.options.map((opt) => (
                  <label 
                    key={opt.id}
                    className={"flex items-center justify-between p-2 border-2 border-black rounded-xl cursor-pointer transition " + 
                      (selectedExtras[opt.id] ? 'bg-brandYellow' : 'hover:bg-brandYellow/30')}
                  >
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={!!selectedExtras[opt.id]}
                        onChange={(e) => {
                          setSelectedExtras({
                            ...selectedExtras,
                            [opt.id]: e.target.checked
                          });
                        }}
                        className="w-4 h-4 accent-black rounded cursor-pointer"
                      />
                      <span>{opt.name}</span>
                    </div>
                    <span className="font-bold">
                      {opt.priceDelta > 0 ? `+$${opt.priceDelta.toFixed(2)}` : 'Gratis'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity Controls */}
          <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-gray-300">
            <span className="font-display font-bold text-sm uppercase">Cantidad:</span>
            <div className="flex items-center gap-3 bg-brandPillBg px-3 py-1.5 rounded-2xl border-2 border-black">
              <button 
                type="button" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-black font-black flex items-center justify-center hover:bg-black hover:text-white"
              >
                -
              </button>
              <span className="font-display font-black text-base w-6 text-center">{quantity}</span>
              <button 
                type="button" 
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-black font-black flex items-center justify-center hover:bg-black hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Add Button */}
        <div className="p-4 border-t-4 border-black bg-brandPillBg flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase">Subtotal</div>
            <div className="font-display font-black text-xl text-black">${totalPrice.toFixed(2)}</div>
          </div>
          <button 
            type="button"
            onClick={handleAddToCart}
            className="flex-1 bg-brandYellow hover:bg-brandYellowDark text-black font-display font-black py-3 px-4 rounded-2xl border-2 border-black shadow-brutal hover:shadow-brutal-hover active:translate-x-0.5 active:translate-y-0.5 transition uppercase tracking-wide text-sm flex items-center justify-center gap-2"
          >
            <span>Agregar al pedido</span>
            <span>•</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}