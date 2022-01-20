module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // entities: configService.get('ENTITIES'),
  entities: ['dist/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/**/migrations/*{.ts,.js}'],
  // entities: [User, Role, Permissions, Models, PermissionRole],
  synchronize: Boolean(process.env.SYNCHRONIZE),
  // logging: true,
  cli: {
    migrationsDir: 'src/migrations',
  },
};
