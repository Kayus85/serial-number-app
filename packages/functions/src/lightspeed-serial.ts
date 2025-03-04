import { Resource } from "sst";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { Util } from "@serial-number-app/core/util/index";
import { XSeriesAPI } from "@serial-number-app/core/lightspeed-request/index";
import * as uuid from "uuid";
import { Product } from "@serial-number-app/core/product/index";
import * as Version from "@serial-number-app/core/version/index";
import { pool } from "@serial-number-app/core/dbclient";

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
  let lastVersion: any;
  const config: apiParams = {
    page_size: 100,
    deleted: true,
    after: null,
    before: null,
  };
  const client = await pool.connect();

  // make it any for now till I figure out this TS shit
  const res: any = await Version.getByEntity("products", client);
  console.log(
    "result of Version query:",
    res.rows[0] ? res.rows[0]["version_number"] : "no version for this entity",
  );

  if (res.rows[0]) {
    config["after"] = res.rows[0]["version_number"];
    lastVersion = res.rows[0]["version_number"];
  }
  console.log("config['after']:", config["after"]);
  do {
    lsRecordsPage = await xApi.makeRequest(
      "api/2.0/products",
      "GET",
      null,
      config,
    );

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
      console.log("logging synced products:", product);
      await Product.create(product, client);
    }

    max = lsRecordsPage ? lsRecordsPage.data.version.max : null;

    lastVersion = max ? max : lastVersion;
    config["after"] = max;
  } while (max);

  console.log("value of lastVersion after loop: ", lastVersion);
  const version: Version.Info = {
    id: uuid.v1(),
    entity_name: "products",
    version_number: lastVersion,
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now()),
  };
  await Version.create(version, client);

  client.release();
  return JSON.stringify(lsRecordsPage.data, null, 2);
});
