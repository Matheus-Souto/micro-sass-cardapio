import { Pool } from "pg";

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'microdb',
    password: '683520',
    port: 5432
});