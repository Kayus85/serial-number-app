import { Pool } from "pg";
import { Resource } from "sst";

const pool = new Pool({
  host: Resource.rdsPostgres.host,
  database: Resource.rdsPostgres.database,
  user: Resource.rdsPostgres.username,
  password: Resource.rdsPostgres.password,
  port: Resource.rdsPostgres.port,
});

export async function handler() {
  const res = await createProductTable();
  const res2 = await createVersionTable();
  console.log(res.rows);
  console.log(res.fields);
  console.log(res2.rows);
  console.log(res2.fields);

  return {
    statusCode: 200,
    body: `Querying ${Resource.rdsPostgres.host}\n\n` + res.rows,
  };
}

async function createProductTable() {
  const client = await pool.connect();
  const queryText = `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
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
  client.release();

  return res;
}

async function createVersionTable() {
  const client = await pool.connect();
  const queryText = `CREATE TABLE IF NOT EXISTS versions (
    id UUID PRIMARY KEY,
    entity_name VARCHAR(255) NOT NULL,
    version_number BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`;
  const res = await client.query(queryText);
  client.release();

  return res;
}
