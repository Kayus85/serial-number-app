import { Pool } from "pg";
import { Resource } from "sst";

export const pool = new Pool({
  host: Resource.rdsPostgres.host,
  database: Resource.rdsPostgres.database,
  user: Resource.rdsPostgres.username,
  password: Resource.rdsPostgres.password,
  port: Resource.rdsPostgres.port,
});

export async function connectPgPool() {
  const client = await pool.connect();
  return client;
}
