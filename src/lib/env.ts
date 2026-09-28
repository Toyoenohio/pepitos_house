/**
 * Lectura de variables de entorno, en un solo lugar.
 *
 * El detalle que importa: con el adaptador de Cloudflare, `locals.runtime.env`
 * EXISTE siempre (el platform proxy lo crea), pero en desarrollo local viene
 * vacío: las variables que se pasan por shell no aparecen ahí. Si se hace
 * `runtime.env || process.env`, el fallback nunca entra y en local todo se ve
 * como "sin configurar".
 *
 * Por eso se combinan las dos fuentes: runtime.env manda (Cloudflare), process.env
 * cubre el desarrollo local, los scripts de Node y los tests.
 */
export function runtimeEnv(locals: any): Record<string, any> {
  const runtime = locals?.runtime?.env;
  const proc =
    typeof process !== 'undefined' && process.env ? (process.env as Record<string, any>) : {};
  if (!runtime || typeof runtime !== 'object') return proc;
  return { ...proc, ...runtime };
}

/** Atajo para pedir una variable concreta. */
export function env(locals: any, key: string): string | null {
  const v = runtimeEnv(locals)[key];
  return v === undefined || v === null || v === '' ? null : String(v);
}
