import { Pool } from "pg";
import dotenv from "dotenv-safe";

dotenv.config();

export const pool = new Pool({
    user: String(process.env.USER_DB),
    host: String(process.env.HOST_DB),
    database: String(process.env.DATABASE_DB),
    password: String(process.env.PASSWORD_DB),
    port: Number(process.env.PORT_DB)
});