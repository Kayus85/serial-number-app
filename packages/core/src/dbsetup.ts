import { PoolClient } from "pg";
import { Resource } from "sst";
import { pool } from "./dbclient";

export async function handler() {
  const client = await pool.connect();
  await createProductTable(client);
  await createVersionTable(client);

  client.release();

  return {
    statusCode: 200,
    body: `Querying ${Resource.rdsPostgres.host}\n\n`,
  };
}

async function createProductTable(client: PoolClient) {
  const queryText = `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    product_id UUID UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) NOT NULL,
    supplier VARCHAR(255),
    price NUMERIC(13,4) NOT NULL,
    cost NUMERIC(13,4) NOT NULL,
    active BOOLEAN NOT NULL,
    last_update_ls TIMESTAMP WITH TIME ZONE NOT NULL,
    last_version BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL 
  )`;
  const res = await client.query(queryText);

  return res;
}

async function createVersionTable(client: PoolClient) {
  const queryText = `CREATE TABLE IF NOT EXISTS versions (
    id UUID PRIMARY KEY,
    entity_name VARCHAR(255) UNIQUE NOT NULL,
    version_number BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`;
  const res = await client.query(queryText);

  return res;
}
