import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Neon Database connection string
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Q9sBR3LEyKnP@ep-shy-field-a1p8mnxv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please check your Neon database configuration.",
  );
}

console.log('🔗 Connecting to Neon Database...');
console.log('📍 Database URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@')); // Hide password in logs

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });
