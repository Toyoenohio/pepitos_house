import { persistentMap } from '@nanostores/persistent';
import { INITIAL_PRODUCTS, type MenuItem } from '../lib/productsData';

export interface ProductOverride {
  isAvailable: boolean;
  availableDays: string[];
}

/**
 * Stores product overrides (e.g. 86 / availability toggles and day-of-week active status).
 * Key: productId, Value: JSON encoded ProductOverride
 */
export const $productOverrides = persistentMap<Record<string, ProductOverride>>(
  'ph251_overrides:',
  {},
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export function toggleProduct86(productId: string, currentAvailable: boolean) {
  const current = $productOverrides.get()[productId];
  const initial = INITIAL_PRODUCTS.find(p => p.id === productId);
  const baseDays = current?.availableDays || initial?.availableDays || ['thu', 'fri', 'sat', 'sun', 'mon'];

  $productOverrides.setKey(productId, {
    isAvailable: !currentAvailable,
    availableDays: baseDays,
  });
}

export function toggleProductDay(productId: string, dayKey: string) {
  const current = $productOverrides.get()[productId];
  const initial = INITIAL_PRODUCTS.find(p => p.id === productId);
  const baseAvailable = current ? current.isAvailable : (initial?.isAvailable ?? true);
  const days = current?.availableDays || initial?.availableDays || ['thu', 'fri', 'sat', 'sun', 'mon'];

  const newDays = days.includes(dayKey)
    ? days.filter(d => d !== dayKey)
    : [...days, dayKey];

  $productOverrides.setKey(productId, {
    isAvailable: baseAvailable,
    availableDays: newDays,
  });
}

export function getEffectiveProduct(product: MenuItem, overrides: Record<string, ProductOverride>): MenuItem {
  const override = overrides[product.id];
  if (!override) return product;

  return {
    ...product,
    isAvailable: override.isAvailable,
    availableDays: override.availableDays,
  };
}
