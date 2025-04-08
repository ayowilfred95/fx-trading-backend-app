import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();


// Determine file extensions based on environment
const isProd = process.env.NODE_ENV === 'production';
const entities = [path.resolve(__dirname, '..', '..', '**/*.entity{.ts,.js}')];
const migrations = [path.resolve(__dirname, '..', '..', 'migrations', '*{.ts,.js}')];




export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: entities,
    migrations: migrations,
    synchronize: false,
    logging: !isProd,
    migrationsTableName: 'migrations',
  });