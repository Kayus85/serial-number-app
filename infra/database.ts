export const vpc = new sst.aws.Vpc("databaseVpc");
export const rds = new sst.aws.Postgres("rdsPostgres", {
  vpc,
  dev: {
    username: "postgres",
    password: "password",
    database: "local",
    port: 5432,
  },
});
