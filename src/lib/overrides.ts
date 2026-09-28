/**
 * Overrides de disponibilidad del menú, en la base de datos (Neon).
 *
 * Antes el panel admin escribía los "86" (agotado) y los días activos en
 * localStorage: cada visitante veía el menú completo y el cliente no podía
 * gestionar nada de verdad. Ahora se guardan en `menu_items` y el sitio los lee
 * al renderizar, así que el cambio lo ve todo el mundo.
 *
 * Regla: si la base no está disponible, el sitio NO se rompe — devuelve vacío y
 * se muestra el catálogo estático tal cual.
 */
import { getDb } from '../db/client';
import { menuItems } from '../db/schema';
import { INITIAL_PRODUCTS, type MenuItem } from './productsData';

export interface ProductOverride {
  isAvailable: boolean;
  availableDays: string[];
}

export type OverrideMap = Record<string, ProductOverride>;

/** Lee los overrides desde Neon. Nunca lanza: degrada a `{}`. */
export async function loadOverrides(locals: any): Promise<OverrideMap> {
  const ru = locals?.runtime;
  const env = ru?.env || (typeof process !== 'undefined' ? process.env : {});
  const db = getDb(env?.DATABASE_URL);
  if (!db) return {};
  try {
    const rows = await db
      .select({ id: menuItems.id, isAvailable: menuItems.isAvailable, availableDays: menuItems.availableDays })
      .from(menuItems);
    const out: OverrideMap = {};
    for (const r of rows as any[]) {
      const days = Array.isArray(r.availableDays) ? r.availableDays : ['thu', 'fri', 'sat', 'sun', 'mon'];
      out[String(r.id)] = { isAvailable: !!r.isAvailable, availableDays: days };
    }
    return out;
  } catch {
    return {};
  }
}

/** Aplica los overrides al catálogo estático. */
export function applyOverrides(products: MenuItem[], overrides: OverrideMap): MenuItem[] {
  if (!overrides || Object.keys(overrides).length === 0) return products;
  return products.map((p) => {
    const o = overrides[p.id];
    if (!o) return p;
    return { ...p, isAvailable: o.isAvailable, availableDays: o.availableDays };
  });
}

/** ¿El producto se ofrece hoy? (día local de Venezuela, UTC-4) */
export function isAvailableToday(p: MenuItem, now = new Date()): boolean {
  if (p.isAvailable === false) return false;
  const days = (p as any).availableDays as string[] | undefined;
  if (!Array.isArray(days) || days.length === 0) return true;
  const ve = new Date(now.getTime() - 4 * 60 * 60 * 1000); // UTC-4
  const key = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][ve.getUTCDay()];
  return days.includes(key);
}

export { INITIAL_PRODUCTS };
