import { Pool, PoolClient } from "pg";
import { Resource } from "sst";
export * as Product from "./index";

export interface Info {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  supplier: string;
  price: number;
  cost: number;
  active: boolean;
  last_update_ls: Date;
  last_version: number;
  created_at: Date;
  updated_at: Date;
}

const pool = new Pool({
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

export async function releasePgPool(client: PoolClient) {
  client.release();
}
export async function create(_product: Info, client: PoolClient) {
  const queryText = `INSERT INTO products (
    id, product_id, name, sku,
    supplier, price, cost, active,
    last_update_ls, last_version,
    created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

  try {
    await client.query("BEGIN");

    await client.query(queryText, [
      _product.id,
      _product.product_id,
      _product.name,
      _product.sku,
      _product.supplier,
      _product.price,
      _product.cost,
      _product.active,
      _product.last_update_ls,
      _product.last_version,
      _product.created_at,
      _product.updated_at,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting record: ", error);
  }
  return client;
}
