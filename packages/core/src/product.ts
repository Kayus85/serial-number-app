import { v1 } from "uuid";
export * as Product from "./product";

interface Info {
  id: string;
  name: string;
  sku: string;
  supplier: string;
  price: number;
  cost: number;
  last_update_ls: Date;
  last_version: number;
  created_at: Date;
  updated_at: Date;
}

export function create(_product: Info) {
  return undefined as unknown;
}
