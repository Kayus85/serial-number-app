import { Resource } from "sst";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { Util } from "@serial-number-app/core/util";
import { XSeriesAPI } from "@serial-number-app/core/lightspeed-request";

export const main = Util.handler(async (_event) => {
  const xApi = new XSeriesAPI.XSeriesRequest(
    "kaysgoods",
    `${Resource.LightspeedXApiToken.value}`,
  );

  interface apiParams {
    after?: number;
    before?: number;
    page_size: number;
    deleted?: boolean;
  }

  const config: apiParams = {
    page_size: 100,
    deleted: true,
  };
  const products = await xApi.makeRequest(
    "api/2.0/products",
    "GET",
    null,
    config,
  );

  return JSON.stringify(products, null, 2);
});
