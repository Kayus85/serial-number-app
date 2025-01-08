import { Resource } from "sst";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { Util } from "@serial-number-app/core/util";
import { XSeriesAPI } from "@serial-number-app/core/lightspeed-request";

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
    page_size: 100,
    deleted: true,
    after: null,
    before: null,
  };

  do {
    lsRecordsPage = await xApi.makeRequest(
      "api/2.0/products",
      "GET",
      null,
      config,
    );

    max = lsRecordsPage
      ? lsRecordsPage.data.version.max
      : { LSApi: "no records returned" };

    config["after"] = max;
  } while (max);

  return JSON.stringify(lsRecordsPage.data, null, 2);
});
