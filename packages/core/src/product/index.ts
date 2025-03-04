import { PoolClient } from "pg";
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

export async function create(_product: Info, client: PoolClient) {
  const queryText = `INSERT INTO products (
    id, product_id, name, sku,
    supplier, price, cost, active,
    last_update_ls, last_version,
    created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    ON CONFLICT (product_id) DO UPDATE SET
    name = excluded.name,
    sku = excluded.sku,
    supplier = excluded.sku,
    price = excluded.price,
    cost = excluded.cost,
    active = excluded.active,
    last_update_ls = excluded.last_update_ls, 
    last_version = excluded.last_version,
    updated_at = excluded.updated_at
    `;

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
