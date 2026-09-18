import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function getDb(databaseUrl?: string) {
  const connString = databaseUrl || process.env.DATABASE_URL;
  if (!connString) {
    return null;
  }
  const sql = neon(connString);
  return drizzle(sql, { schema });
}
