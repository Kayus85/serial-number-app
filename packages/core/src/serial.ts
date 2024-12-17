import { Resource } from "sst";
export * as Serial from "./serial";

interface Info {
  serialID: string;
  serialNumber: string;
  userID: string;
  productID: string;
  outletID: string;
  cost?: number;
  date?: Date;
  note?: string;
  processed: boolean;
  created: Date;
  archived?: Date;
}

export function create(_serial: Info) {
  return undefined as unknown;
}

export function update(_input: {
  cost: number;
  date: Date;
  note: string;
  processed: boolean;
}) {
  return undefined as unknown;
}

export function list(_serial: Info) {
  return undefined as unknown;
}

export function fromSerialID(_serialID: string) {
  return undefined as unknown;
}

export function fromSerialNumber(_serialNumber: string) {
  return undefined as unknown;
}

export function fromProductID(_productID: string) {
  return undefined as unknown;
}
