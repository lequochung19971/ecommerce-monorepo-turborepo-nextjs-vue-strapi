// Localhost Database
// eslint-disable-next-line import/no-anonymous-default-export
export default ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "ecommerce"),
      user: env("DATABASE_USERNAME", "lequochung19971"),
      password: env("DATABASE_PASSWORD", "Lequochung@12"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});

// Azure Database
// eslint-disable-next-line import/no-anonymous-default-export
// export default ({ env }) => ({
//   connection: {
//     client: "postgres",
//     connection: {
//       host: env(
//         "DATABASE_HOST",
//         "ecommerce-postgresql-db-dev.postgres.database.azure.com"
//       ),
//       port: env.int("DATABASE_PORT", 5432),
//       database: env("DATABASE_NAME", "ecommerce-db"),
//       user: env(
//         "DATABASE_USERNAME",
//         "lequochung19971@ecommerce-postgresql-db-dev"
//       ),
//       password: env("DATABASE_PASSWORD", "Lequochung@12"),
//       ssl: env.bool("DATABASE_SSL", true),
//     },
//   },
// });
