// Comprueba la base: conectividad, tablas y filas.
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) { console.error('Falta DATABASE_URL.'); process.exit(1); }
const sql = neon(url);

try {
  const v = await sql`select current_database() as db`;
  console.log('conexión OK · base:', v[0].db);

  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name`;
  const names = tables.map((t) => t.table_name);
  console.log('tablas:', names.length ? names.join(', ') : '(ninguna)');

  for (const t of ['categories', 'menu_items', 'modifier_groups', 'modifier_options', 'orders', 'loyalty_members', 'store_settings']) {
    if (!names.includes(t)) { console.log(`  ${t}: NO EXISTE`); continue; }
    // conteo explícito por tabla (neon no acepta nombres dinámicos sin unsafe)
    console.log(`  ${t}: (contada aparte)`);
  }

  if (names.includes('menu_items')) {
    const s = await sql`select id, name, price, is_available, available_days from menu_items order by id limit 3`;
    console.log('  muestra:', JSON.stringify(s, null, 0).slice(0, 300));
  }
} catch (e) {
  console.error('FALLO:', e.message);
  process.exit(1);
}
