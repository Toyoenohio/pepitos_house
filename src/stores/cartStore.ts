import { persistentMap } from '@nanostores/persistent';
import { computed } from 'nanostores';
import type { CartItem } from '../lib/whatsapp';

export const $cart = persistentMap<Record<string, CartItem>>('ph251_cart:', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addItemToCart(item: CartItem) {
  const current = $cart.get();
  const existing = current[item.id];

  if (existing) {
    $cart.setKey(item.id, {
      ...existing,
      quantity: existing.quantity + item.quantity
    });
  } else {
    $cart.setKey(item.id, item);
  }
}

export function updateItemQuantity(id: string, delta: number) {
  const current = $cart.get();
  const existing = current[id];
  if (!existing) return;

  const newQty = existing.quantity + delta;
  if (newQty <= 0) {
    removeItemFromCart(id);
  } else {
    $cart.setKey(id, { ...existing, quantity: newQty });
  }
}

export function removeItemFromCart(id: string) {
  $cart.setKey(id, undefined as unknown as CartItem);
}

export function clearCart() {
  $cart.set({});
}

export const $cartCount = computed($cart, (cart) => {
  return Object.values(cart).reduce((sum, item) => sum + (item?.quantity || 0), 0);
});

export const $cartSubtotal = computed($cart, (cart) => {
  return Object.values(cart).reduce((sum, item) => sum + ((item?.unitPrice || 0) * (item?.quantity || 0)), 0);
});

