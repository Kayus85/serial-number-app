import { PoolClient, QueryResult } from "pg";

export interface Info {
  id: string;
  entity_name: string;
  version_number: number;
  created_at: Date;
  updated_at: Date;
}

export async function create(_version: Info, client: PoolClient) {
  const queryText = `INSERT INTO versions (
    id, entity_name, version_number, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (entity_name) DO UPDATE SET
    version_number = excluded.version_number,
    updated_at = excluded.updated_at`;
  try {
    await client.query("BEGIN");
    await client.query(queryText, [
      _version.id,
      _version.entity_name,
      _version.version_number,
      _version.created_at,
      _version.updated_at,
    ]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error inserting record: ", error);
  }
  return client;
}

export async function getByEntity(entity: string, client: PoolClient) {
  const queryText = `SELECT version_number FROM versions WHERE entity_name = $1`;
  let res;
  try {
    await client.query("BEGIN");
    res = await client.query(queryText, [entity]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error getting record: ", error);
  }
  if (res) {
    return res;
  }
}
// A function to check if entity exists in version table
// pass entity name and version to it
// if it exists, overwrite the version
// if it does not create a row for entity with version number
//
// another function to retrieve version number for a given entity
