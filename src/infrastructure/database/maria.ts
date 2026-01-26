import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { Database } from './schema';

const configDb = new MysqlDialect({
    pool: createPool({
        database: 'internal_office',
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: 3306,
        connectionLimit: 10,
    })
});

export const db = new Kysely<Database>({
    dialect: configDb
});