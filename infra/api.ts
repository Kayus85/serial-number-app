import { secret } from "./secrets";
import { rds } from "./database";

export const api = new sst.aws.ApiGatewayV2("Api", {
  link: [secret.LightspeedXApiToken, rds],
});

api.route("GET /", {
  handler: "packages/functions/src/lightspeed-serial.main",
});
