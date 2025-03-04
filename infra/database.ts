export const vpc = new sst.aws.Vpc("databaseVpc", { nat: "ec2" });
export const rds = new sst.aws.Postgres("rdsPostgres", {
  vpc,
  dev: {
    username: "postgres",
    password: "password",
    database: "local",
    port: 5432,
  },
});

new sst.aws.Function("testRDS", {
  vpc,
  url: true,
  link: [rds],
  handler: "packages/core/src/dbsetup.handler",
});
