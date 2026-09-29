import { getDb } from '../db/client';
import { storeSettings } from '../db/schema';
import { checkRestaurantOpen, type ScheduleStatus } from './availability';
import { runtimeEnv } from './env';

export type StoreMode = 'open' | 'closed' | 'auto';

export interface StoreStatusResult {
  isOpen: boolean;
  mode: StoreMode;
  message: string;
  notice: string;
  updatedAt?: string;
  scheduleInfo: ScheduleStatus;
}

/**
 * Obtiene el estado efectivo del local (si está abierto o cerrado para pedidos).
 * Prioridad:
 * 1. 'open': Forzado abierto manualmente por el administrador (ignora horario).
 * 2. 'closed': Forzado cerrado manualmente por el administrador (bloquea pedidos).
 * 3. 'auto': Se rige por el horario estándar (Jueves a Lunes 3:00 PM a 10:00 PM VET).
 */
export async function getEffectiveStoreStatus(locals?: any): Promise<StoreStatusResult> {
  const scheduleInfo = checkRestaurantOpen();
  const env = runtimeEnv(locals);
  const db = getDb(env?.DATABASE_URL);

  let mode: StoreMode = 'auto';
  let notice = '';
  let updatedAt: string | undefined;

  if (db) {
    try {
      const rows = await db.select().from(storeSettings);
      for (const r of rows) {
        if (r.key === 'store_mode') {
          const val = r.value.toLowerCase().trim();
          if (val === 'open' || val === 'closed' || val === 'auto') {
            mode = val as StoreMode;
          }
          updatedAt = r.updatedAt ? r.updatedAt.toISOString() : undefined;
        } else if (r.key === 'store_notice') {
          notice = r.value.trim();
        }
      }
    } catch {
      // Degrada limpiamente a modo automático si la base no responde
      mode = 'auto';
    }
  }

  let isOpen = false;
  let message = '';

  if (mode === 'open') {
    isOpen = true;
    message = notice || '¡Estamos abiertos y recibiendo pedidos! (Horario especial activo)';
  } else if (mode === 'closed') {
    isOpen = false;
    message = notice || 'El local se encuentra cerrado temporalmente por la administración.';
  } else {
    // Modo automático: se guía por el horario
    isOpen = scheduleInfo.isOpen;
    message = notice ? `${notice} — ${scheduleInfo.message}` : scheduleInfo.message;
  }

  return {
    isOpen,
    mode,
    message,
    notice,
    updatedAt,
    scheduleInfo,
  };
}
