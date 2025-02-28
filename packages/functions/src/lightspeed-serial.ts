import { Resource } from "sst";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { Util } from "@serial-number-app/core/util";
import { XSeriesAPI } from "@serial-number-app/core/lightspeed-request";
import * as uuid from "uuid";
import { Product } from "@serial-number-app/core/product";

export const main = Util.handler(async () => {
  const xApi = new XSeriesAPI.XSeriesRequest(
    "kaysgoods",
    `${Resource.LightspeedXApiToken.value}`,
  );

  interface apiParams {
    after?: number | null;
    before?: number | null;
    page_size: number;
    deleted?: boolean;
  }

  let max: number | null;
  let lsRecordsPage: any;
  const config: apiParams = {
    page_size: 5,
    deleted: true,
    after: null,
    before: null,
  };

  let i: number = 0;
  do {
    lsRecordsPage = await xApi.makeRequest(
      "api/2.0/products",
      "GET",
      null,
      config,
    );

    // eachRecord(lsRecordsPage["data"]["data"]);
    const client = await Product.connectPgPool();
    let product: Product.Info;
    for (const record of lsRecordsPage["data"]["data"]) {
      product = {
        id: uuid.v1(),
        product_id: record["id"],
        name: record["name"],
        sku: record["sku"],
        supplier: record["supplier"] ? record["supplier"]["name"] : "",
        price: record["price_excluding_tax"],
        cost: record["supply_price"],
        active: record["active"],
        last_update_ls: record["updated_at"],
        last_version: record["version"],
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
      await Product.create(product, client);
    }

    client.release();

    max = lsRecordsPage
      ? lsRecordsPage.data.version.max
      : { LSApi: "no records returned" };

    config["after"] = max;
    i++;
  } while (i < 2);

  return JSON.stringify(lsRecordsPage.data, null, 2);
});

interface productRecord {
  product_id: string;
  name: string | null;
  sku: string | null;
  supplier: string | null;
  price: number;
  cost: number;
  active: boolean;
  last_update_ls: Date;
  last_version: number;
}

async function eachRecord(records) {
  let product: productRecord;
  for (const record of records) {
    product = {
      product_id: record["id"],
      name: record["name"],
      sku: record["sku"],
      supplier: record["supplier"] ? record["supplier"]["name"] : "",
      price: record["price_excluding_tax"],
      cost: record["supply_price"],
      active: record["active"],
      last_update_ls: record["updated_at"],
      last_version: record["version"],
    };
    console.log(product);
  }
}
