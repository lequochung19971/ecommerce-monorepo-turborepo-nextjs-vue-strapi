export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'ecommerce'),
      user: env('DATABASE_USERNAME', 'lequochung19971'),
      password: env('DATABASE_PASSWORD', 'Lequochung@12'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
