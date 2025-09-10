import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import dotenv  from "dotenv";
dotenv.config();

console.log("database", process.env.PGDATABASE);

const pool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    database: process.env.PGDATABASE || "mydb",
    password: process.env.PGPASSWORD || "password",
    port: Number(process.env.PGPORT) || 5432,
    ssl: { rejectUnauthorized: false },
});
console.log("pankaj",process.env.PGUSER)

// Simple query logging with one environment variable
if (process.env.LOG_QUERIES === 'true') {
    const originalQuery = pool.query.bind(pool);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pool.query = (text: any, params?: any) => {
        const query = typeof text === 'string' ? text : text.text;
        console.log('🔍 SQL:', query);
        if (params && params.length > 0) {
            console.log('📝 Params:', params);
            // Show actual query with parameters substituted
            let actualQuery = query;
            interface QueryParam {
                value: string | number | boolean | Date | null | undefined;
            }

            params.forEach((param: QueryParam['value'], index: number) => {
                const placeholder: string = `$${index + 1}`;
                let value: string = param as string;
                
                // Format different data types for display
                if (typeof param === 'string') {
                    value = `'${param.replace(/'/g, "''")}'`;
                } else if (param === null || param === undefined) {
                    value = 'NULL';
                } else if (param instanceof Date) {
                    value = `'${param.toISOString()}'`;
                } else if (typeof param === 'boolean') {
                    value = param ? 'TRUE' : 'FALSE';
                }
                
                actualQuery = actualQuery.replace(new RegExp(`\\${placeholder}\\b`, 'g'), String(value));
            });
            console.log('🔗 Actual Query:', actualQuery);
        }
        return originalQuery(text, params);
    };
}

export const db = drizzle(pool, { schema });